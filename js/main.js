// Variables //
var $defaultText = createDefaultText();

// DOM Queries

var $journalForm = document.querySelector('form');
var $journalFormTitle = document.querySelector('form h1');
var $journalFormDeleteRow = document.querySelector('.delete');
var $journalFormDeleteBtn = document.querySelector('.link-btn');
var $deleteModal = document.querySelector('.del-modal');
var $modalCancel = document.querySelector('.close-modal');
var $modalConfirm = document.querySelector('.confirm-modal');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');
var $searchbar = document.querySelector('.searchbar');
var $entryNav = document.querySelector('.entry-nav');
var $newEntryButton = document.querySelector('.new-entry');
var $entryUl = document.querySelector('.entry-ul');
var $addTag = document.querySelector('.tag-btn');
var $tagModal = document.querySelector('.tag-modal');
var $tagUl = document.querySelector('.tag-box ul');
var $tagInput = document.querySelector('.tag-box input');
var $closeTags = document.querySelector('.close-tags');
var $tagBox = document.querySelector('.tag-box');
var $tagsRemaining = document.querySelector('.tags-remaining');
var $deleteAllTags = document.querySelector('.delete-all-tags');
var $formTagUl = document.querySelector('.tags');

// Window Listener //

window.addEventListener('DOMContentLoaded', function (event) { // loads previous session data (if present) after DOM loads
  if (data.entries.length === 0) { // if entries if empty, display default text
    $entryUl.append($defaultText);
  }
  for (let i = 0; i < data.entries.length; i++) {
    var previousEntry = renderEntry(data.entries[i]);
    $entryUl.append(previousEntry);
  }
});

// Entries Page //

$newEntryButton.addEventListener('click', function (event) { // swaps view to entry form
  resetForm();
  displayTagsOnForm();
  data.newTags = [];
  $journalFormTitle.textContent = 'Create Entry';
  viewSwap('entry-form');
});

$entryUl.addEventListener('click', function (event) { // edit an entry
  $journalFormTitle.textContent = 'Edit Entry';
  renderDeleteBtn();
  assignToEditing(event);
  displayTagsOnForm();
});

$entryNav.addEventListener('click', function (event) { // swaps view to entries
  data.editing = null;
  resetForm();
  if ($journalFormDeleteBtn.className !== 'link-btn hidden') {
    removeDeleteBtn();
  }
  viewSwap('entries');
});

function renderEntry(entry) { // creates DOM tree for an individual entry
  /**
   * <li data-entry-id="" class="row mb-1-rem">
   *   <div class="column-half">
   *     <img class="entry" src="" alt="">
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
  $imageTag.classList = 'entry';

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

// Journal Form -- NEW ENTRY //

$photoUrlInput.addEventListener('input', handleImageUrl); // loads photo when url is added to input field

function handleImageUrl(event) { // handles input urls from entry form and renders them
  if (isImage($photoUrlInput.value)) {
    $image.setAttribute('src', $photoUrlInput.value);
  }
}

function isImage(url) { // checks if an image ends in common extensions, returns T / F
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

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

function handleNewSubmit(event) { // handles the submit event for a new entry
  event.preventDefault();
  var formData = {};
  formData.title = $journalForm.elements.title.value;
  formData['photo-url'] = $journalForm.elements['photo-url'].value;
  formData.notes = $journalForm.elements.notes.value;
  formData.tags = data.newTags;
  formData.entryID = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(formData);
  $entryUl.prepend(renderEntry(formData)); // add the new image to the top of the container
  data.newTags = [];
}

// Journal Form -- EDIT ENTRY //

$journalFormDeleteBtn.addEventListener('click', function (event) { // pull up model when delete button is clicked
  $deleteModal.className = 'modal dark-overlay';
});

$modalCancel.addEventListener('click', function (event) { // exits user from modal interface
  $deleteModal.className = 'modal hidden';
});

$modalConfirm.addEventListener('click', function (event) { // deletes currently selected entry
  removeEntry(event);
  $deleteModal.className = 'modal hidden';
  viewSwap('entries');
});

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

function handleEditSubmit(event) { // handles the submit event for editing an entry
  event.preventDefault();
  data.editing.title = $journalForm.elements.title.value;
  data.editing['photo-url'] = $journalForm.elements['photo-url'].value;
  data.editing.notes = $journalForm.elements.notes.value;
  var $nodeToReplace = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`);
  $nodeToReplace.replaceWith(renderEntry(data.editing));
  data.editing = null;
  removeDeleteBtn();
}

function removeEntry(entry) { // removes entry from dom tree and data model
  var $nodeToDelete = document.querySelector(`li[data-entry-id="${data.editing.entryID}"]`); // remove entry from the dom tree
  $nodeToDelete.remove();
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryID === data.editing.entryID) { // remove entry from the data model
      data.entries.splice(i, 1);
    }
  }
  if (data.entries.length === 0) {
    $entryUl.append($defaultText);
  }
  data.editing = null;
}

// Search Bar //

$searchbar.addEventListener('input', function (event) { // handle search bar input
  filterSearchbarResult(event);
});

function filterSearchbarResult(event) {
  var query = '';
  var regexEscapes = ['[', ']', '(', ')', '/', '?', '+'];
  var splitQuery = event.target.value.split('');
  for (let i = 0; i < splitQuery.length; i++) {
    if (regexEscapes.includes(splitQuery[i])) {
      query += '\\' + splitQuery[i];
    } else { query += splitQuery[i]; }
  }
  const regex = new RegExp(query);
  for (let i = 0; i < data.entries.length; i++) {
    const notesResult = regex.test(data.entries[i].notes);
    const headResult = regex.test(data.entries[i].title);
    if (notesResult || headResult) {
      var $showNode = document.querySelector(`[data-entry-id="${data.entries[i].entryID}"]`);
      $showNode.classList = 'row mb-1-rem';
    } else {
      var $hideNode = document.querySelector(`[data-entry-id="${data.entries[i].entryID}"]`);
      $hideNode.classList = 'row mb-1-rem hidden';
    }
  }
}
// Tags //

$addTag.addEventListener('click', function (event) { // opens the tag create / edit modal
  $tagModal.classList.remove('hidden');
  prefillTags();
  updateTagCount();
});

$closeTags.addEventListener('click', function (event) { // closes the modal
  $tagModal.classList.add('hidden');
  displayTagsOnForm();
});

$tagInput.addEventListener('keyup', function (event) { // add new tag to html
  if (event.key === 'Enter') {
    addTag(event);
  }
});

$tagBox.addEventListener('click', function (event) {
  deleteTag(event);
});

$formTagUl.addEventListener('click', function (event) {
  deleteTag(event);
});

$deleteAllTags.addEventListener('click', function (event) {
  deleteAllTags();
  updateTagCount();
});

function renderTag(tagText) { // returns a tag with appropriate text
  /**
   * <li class="tag">
   *  <span>html</span>
   *  <i class="fa-regular fa-circle-xmark"></i>
   * </li>
  */
  var $liTag = document.createElement('li');
  $liTag.className = 'tag';

  var $tagSpan = document.createElement('span');
  $tagSpan.textContent = tagText;
  $tagSpan.className = 'pr-quarter-rem';
  var $tagIcon = document.createElement('i');
  $tagIcon.className = 'fa-regular fa-circle-xmark';

  $liTag.append($tagSpan, $tagIcon);
  return $liTag;
}

function addTag(event) { // stores the new tag on the entries object for new entries, on editing for editing entries
  var tag = event.target.value.replace(/\s | /g, ' ');
  if (data.editing === null) { // if new entry, add tag to tags array on entries object
    if (tag.length > 1 && data.newTags === undefined) {
      data.newTags = [];
    }
    if (tag.length > 1 && !data.newTags.includes(tag)) {
      tag.split(',').forEach(tag => {
        data.newTags.push(tag);
        updateTagCount();
        if (checkTagLimit()) {
          $tagUl.prepend(renderTag(tag));
        } else {
          data.newTags.pop(tag);
        }
      });
    }
  } else { // if editing, add tag to tags array on editing object
    if (tag.length > 1 && !data.editing.tags.includes(tag)) {
      tag.split(',').forEach(tag => {
        data.editing.tags.push(tag);
        updateTagCount();
        if (checkTagLimit()) {
          $tagUl.prepend(renderTag(tag));
        } else {
          data.editing.tags.pop(tag);
        }
      });
    }
  }
  $tagInput.value = '';
}

function deleteTag(event) {
  if (event.target.className === 'fa-regular fa-circle-xmark') {
    var $tagToDelete = event.target.closest('li');
    var $tagText = $tagToDelete.textContent;
    if (data.editing !== null) {
      for (let i = 0; i < data.editing.tags.length; i++) {
        if ($tagText === data.editing.tags[i]) {
          data.editing.tags.splice(i, 1);
          $tagToDelete.remove();
          updateTagCount();
        }
      }
    } else {
      for (let i = 0; i < data.newTags.length; i++) {
        if ($tagText === data.newTags[i]) {
          data.newTags.splice(i, 1);
          $tagToDelete.remove();
          updateTagCount();
        }
      }
    }
  }
}

function deleteAllTags(event) {
  if (data.editing !== null) {
    data.editing.tags = [];
    prefillTags();
  } else {
    data.newTags = [];
    prefillTags();
  }
}

function prefillTags(event) { // updates the tags ul with the most recent tags
  $tagUl.textContent = '';
  $tagUl.appendChild($tagInput);
  $tagInput.className = 'tag-input';
  if (data.editing !== null) { // load previous tabs into the modal if editing
    for (let i = 0; i < data.editing.tags.length; i++) {
      var previousEditTag = renderTag(data.editing.tags[i]);
      $tagUl.prepend(previousEditTag);
    }
  } else {
    for (let i = 0; i < data.newTags.length; i++) {
      var previousNewTag = renderTag(data.newTags[i]);
      $tagUl.prepend(previousNewTag);
    }
  }
}

function displayTagsOnForm() {
  $formTagUl.textContent = '';
  $formTagUl.appendChild($addTag);
  if (data.editing !== null) {
    data.editing.tags.forEach(tag => {
      $formTagUl.prepend(renderTag(tag));
    });
  } else {
    data.newTags.forEach(tag => {
      $formTagUl.prepend(renderTag(tag));
    });
  }
}

function updateTagCount() {
  if (data.editing === null) {
    $tagsRemaining.textContent = 8 - data.newTags.length;
  } else {
    $tagsRemaining.textContent = 8 - data.editing.tags.length;
  }
}

function checkTagLimit() {
  if (parseInt($tagsRemaining.textContent) < 0) {
    $tagsRemaining.textContent = 0;
    return false;
  } else return true;
}

// Adjust View //

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
