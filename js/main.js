// DOM Queries

var $journalForm = document.querySelector('form');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');
var $entryNav = document.querySelector('.entry-nav');
var $newEntryButton = document.querySelector('.new-entry');
var $entryContainer = document.querySelector('.entry-container');
var $defaultText = createDefaultText();
// Event Listeners

$photoUrlInput.addEventListener('input', handleImageUrl); // loads photo when url is added to input field

$journalForm.addEventListener('submit', function (event) { // passes form data into storage and swaps the view to entries
  if (data.entries.length === 0) {
    $defaultText.remove();
  }
  handleSubmit(event);
  viewSwap('entries');
});

window.addEventListener('DOMContentLoaded', function (event) { // loads previous session data (if present) after DOM loads
  if (data.entries.length === 0) { // if entries if empty, display default text
    $entryContainer.append($defaultText);
  }
  for (let i = 0; i < data.entries.length; i++) {
    var previousEntry = renderEntry(data.entries[i]);
    $entryContainer.append(previousEntry);
  }
});

$entryNav.addEventListener('click', function (event) { // swaps view to entries
  viewSwap('entries');
});

$newEntryButton.addEventListener('click', function (event) { // swaps view to entry form
  viewSwap('entry-form');
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

function handleSubmit(event) { // handles the submit event on the new entry form
  event.preventDefault();
  var formData = {};
  formData.title = $journalForm.elements.title.value;
  formData['photo-url'] = $journalForm.elements['photo-url'].value;
  formData.notes = $journalForm.elements.notes.value;
  formData.entryID = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(formData);
  $entryContainer.prepend(renderEntry(formData)); // add the new image to the top of the container
  $journalForm.reset();
  $image.setAttribute('src', 'images/placeholder-image-square.jpg'); // reset image to default
}

function createDefaultText() { // creates default text if there are no previous entries
  var output = document.createElement('p');
  output.className = 'text-center default-text';
  output.textContent = 'No entries have been recorded... yet!';
  return output;
}

function renderEntry(entry) { // creates DOM tree for an individual entry
  /**
   * <ul class="row mb-1-rem">
   *   <li class="column-half">
   *     <img src="" alt="">
   *   </li>
   *   <li class="column-half">
   *     <h2 class="entry-title"></h2>
   *     <p class="entry-description">
   *   </li>
   * </ul>
  */
  var $entry = document.createElement('ul');
  $entry.classList = 'row mb-1-rem';

  var $imageLi = document.createElement('li');
  $imageLi.classList = 'column-half';

  var $imageTag = document.createElement('img');
  $imageTag.setAttribute('src', entry['photo-url']);
  $imageTag.setAttribute('alt', `${entry.title}-img`);

  var $textLi = document.createElement('li');
  $textLi.classList = 'column-half';

  var $h2Tag = document.createElement('h2');
  $h2Tag.classList = 'entry-title';
  $h2Tag.textContent = entry.title;

  var $pTag = document.createElement('p');
  $pTag.classList = 'entry-description';
  $pTag.textContent = entry.notes;

  $entry.append($imageLi, $textLi);
  $imageLi.append($imageTag);
  $textLi.append($h2Tag, $pTag);

  return $entry;
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
