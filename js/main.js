// DOM Queries

var $journalForm = document.querySelector('form');
var $journalFormTitle = document.querySelector('form h1');
var $journalFormDeleteRow = document.querySelector('.delete');
var $journalFormDeleteBtn = document.querySelector('.link-btn');
var $deleteModal = document.querySelector('.modal');
var $modalCancel = document.querySelector('.close-modal');
var $modalConfirm = document.querySelector('.confirm-modal');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');
var $entryNav = document.querySelector('.entry-nav');
var $newEntryButton = document.querySelector('.new-entry');
var $entryUl = document.querySelector('.entry-ul');
var $defaultText = createDefaultText();

// Event Listeners

$photoUrlInput.addEventListener('input', handleImageUrl); // loads photo when url is added to input field

$journalForm.addEventListener('submit', function (event) { // passes form data into storage and swaps the view to entries
  if (data.entries.length === 0) {
    $defaultText.remove();
  }
  if (data.editing) {
    handleEditSubmit(event);
  } else {
    handleNewSubmit(event);
  }

  viewSwap('entries');
});

window.addEventListener('DOMContentLoaded', function (event) { // loads previous session data (if present) after DOM loads
  if (data.entries.length === 0) { // if entries if empty, display default text
    $entryUl.append($defaultText);
  }
  for (let i = 0; i < data.entries.length; i++) {
    var previousEntry = renderEntry(data.entries[i]);
    $entryUl.append(previousEntry);
  }
});

$entryNav.addEventListener('click', function (event) { // swaps view to entries
  resetForm();
  if ($journalFormDeleteBtn.className !== 'link-btn hidden') {
    removeDeleteBtn();
  }
  viewSwap('entries');
});

$newEntryButton.addEventListener('click', function (event) { // swaps view to entry form
  $journalFormTitle.textContent = 'Create Entry';
  viewSwap('entry-form');
});

$entryUl.addEventListener('click', function (event) { // edit an entry
  $journalFormTitle.textContent = 'Edit Entry';
  renderDeleteBtn();
  assignToEditing(event);
});

$journalFormDeleteBtn.addEventListener('click', function (event) { // pull up model when delete button is clicked
  $deleteModal.className = 'modal';
});

$modalCancel.addEventListener('click', function (event) { // exits user from modal interface
  $deleteModal.className = 'modal hidden';
});

$modalConfirm.addEventListener('click', function (event) { // deletes currently selected entry
  removeEntry(event);
  $deleteModal.className = 'modal hidden';
  viewSwap('entries');
});
// Functions

function handleImageUrl(event) { // handles input urls from entry form and renders them
  if (isImage($photoUrlInput.value)) {
    $image.setAttribute('src', $photoUrlInput.value);
  }
}

function isImage(url) { // checks if an image ends in common extensions, returns T / F
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function handleNewSubmit(event) { // handles the submit event for a new entry
  event.preventDefault();
  var formData = {};
  formData.title = $journalForm.elements.title.value;
  formData['photo-url'] = $journalForm.elements['photo-url'].value;
  formData.notes = $journalForm.elements.notes.value;
  formData.entryID = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(formData);
  $entryUl.prepend(renderEntry(formData)); // add the new image to the top of the container
  resetForm();
}

function assignToEditing(event) { // assigns the clicked entry to the editing property of data
  if (event.target && event.target.tagName === 'I') {
    for (let i = 0; i < data.entries.length; i++) { // loop through data entries and find matching entry id
      if (data.entries[i].entryID === parseInt(event.target.closest('li').getAttribute('data-entry-id'))) {
        data.editing = data.entries[i];
        prefillForm();
      }
    }
  }
}

function resetForm() {
  $journalForm.reset();
  $image.setAttribute('src', 'images/placeholder-image-square.jpg'); // reset image to default
}

function prefillForm() { // prefills the form with currently selected entry data (found in editing property of data)
  $journalForm.elements.title.value = data.editing.title;
  $journalForm.elements['photo-url'].value = data.editing['photo-url'];
  $journalForm.elements.notes.value = data.editing.notes;
  handleImageUrl();
  viewSwap('entry-form');
}

function handleEditSubmit(event) { // handles the submit event for editing an entry
  event.preventDefault();
  data.editing.title = $journalForm.elements.title.value;
  data.editing['photo-url'] = $journalForm.elements['photo-url'].value;
  data.editing.notes = $journalForm.elements.notes.value;
  var $nodeToReplace = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`);
  $nodeToReplace.replaceWith(renderEntry(data.editing));
  data.editing = null;
  resetForm();
  removeDeleteBtn();
}

function createDefaultText() { // creates default text if there are no previous entries
  var output = document.createElement('p');
  output.className = 'text-center default-text';
  output.textContent = 'No entries have been recorded... yet!';
  return output;
}

function renderDeleteBtn() {
  $journalFormDeleteRow.className = 'row column-full justify-between delete';
  $journalFormDeleteBtn.className = 'link-btn';
}

function removeDeleteBtn() {
  $journalFormDeleteRow.className = 'row column-full justify-end delete';
  $journalFormDeleteBtn.className = 'link-btn hidden';
}

function renderEntry(entry) { // creates DOM tree for an individual entry
  /**
   * <li data-entry-id="" class="row mb-1-rem">
   *   <div class="column-half">
   *     <img src="" alt="">
   *   </div
   *   <div class="column-half">
   *     <div class="row align-center">
   *       <h2 class="entry-title"></h2>
   *       <i class="fa-regular fa-pen-to-square"></i>
   *     </div>
   *     <div class="row"
   *       <p class="entry-description">
   *     </div>
   *   </div>
   * </li>
  */
  var $entryLi = document.createElement('li');
  $entryLi.classList = 'row mb-1-rem';
  $entryLi.setAttribute('data-entry-id', entry.entryID);

  var $imageDiv = document.createElement('div');
  $imageDiv.classList = 'column-half';

  var $imageTag = document.createElement('img');
  $imageTag.setAttribute('src', entry['photo-url']);
  $imageTag.setAttribute('alt', `${entry.title}-img`);

  var $textDiv = document.createElement('div');
  $textDiv.classList = 'column-half';

  var $rowTitleDiv = document.createElement('div');
  $rowTitleDiv.classList = 'row space-between align-baseline';

  var $h2Tag = document.createElement('h2');
  $h2Tag.classList = 'entry-title m-0 flex-basis-90';
  $h2Tag.textContent = entry.title;

  var $editIcon = document.createElement('i');
  $editIcon.classList = 'fa-solid fa-pen-to-square fa-xl';

  var $rowNotesDiv = document.createElement('div');
  $rowNotesDiv.classList = 'row';

  var $pTag = document.createElement('p');
  $pTag.classList = 'entry-description';
  $pTag.textContent = entry.notes;

  $rowTitleDiv.append($h2Tag, $editIcon);
  $rowNotesDiv.append($pTag);
  $imageDiv.append($imageTag);
  $textDiv.append($rowTitleDiv, $rowNotesDiv);
  $entryLi.append($imageDiv, $textDiv);

  return $entryLi;
}

function viewSwap(string) { // swaps to the data-view passed into the function & hides other data-views
  var $dataViews = document.querySelectorAll('[data-view]');
  for (let i = 0; i < $dataViews.length; i++) {
    if ($dataViews[i].getAttribute('data-view') === string) {
      $dataViews[i].className = '';
    } else {
      $dataViews[i].className = 'hidden';
    }
  }
}

function removeEntry(entry) { // removes entry from dom tree and data model
  var $nodeToDelete = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`); // remove entry from the dom tree
  $nodeToDelete.remove();
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryID === data.editing.entryID) { // remove entry from the data model
      data.entries.splice(i, 1);
    }
  }
}
