var $journalForm = document.querySelector('form');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');
var $entryNav = document.querySelector('.entry-nav');
var $newEntryButton = document.querySelector('.new-entry');
var $entryContainer = document.querySelector('.entry-container');

$photoUrlInput.addEventListener('input', handleImageUrl);

$journalForm.addEventListener('submit', function (event) {
  handleSubmit(event);
  viewSwap('entries');
});

window.addEventListener('DOMContentLoaded', function (event) {
  renderEntry(data);
});

$entryNav.addEventListener('click', function (event) {
  viewSwap('entries');
});

$newEntryButton.addEventListener('click', function (event) {
  viewSwap('entry-form');
});

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
  $entryContainer.textContent = ''; // clears the old entry data
  renderEntry(data); // data was just updated, re-render the entries page
  $journalForm.reset();
  $image.setAttribute('src', 'images/placeholder-image-square.jpg'); // reset image to default
}

function renderEntry(entry) { // renders entries from localstorage into index.html
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
  for (let i = 0; i < entry.entries.length; i++) {
    var $entry = document.createElement('ul');
    $entry.classList = 'row mb-1-rem';

    var $imageLi = document.createElement('li');
    $imageLi.classList = 'column-half';

    var $imageTag = document.createElement('img');
    $imageTag.setAttribute('src', entry.entries[i]['photo-url']);
    $imageTag.setAttribute('alt', `${entry.entries[i].title}-img`);

    var $textLi = document.createElement('li');
    $textLi.classList = 'column-half';

    var $h2Tag = document.createElement('h2');
    $h2Tag.classList = 'entry-title';
    $h2Tag.textContent = entry.entries[i].title;

    var $pTag = document.createElement('p');
    $pTag.classList = 'entry-description';
    $pTag.textContent = entry.entries[i].notes;

    $entry.append($imageLi, $textLi);
    $imageLi.append($imageTag);
    $textLi.append($h2Tag, $pTag);

    $entryContainer.append($entry);
  }
}

function viewSwap(string) { // iterates through all data-views, showing only the event-linked view
  var $dataViews = document.querySelectorAll('[data-view]');
  for (let i = 0; i < $dataViews.length; i++) {
    if ($dataViews[i].getAttribute('data-view') === string) {
      $dataViews[i].className = '';
    } else {
      $dataViews[i].className = 'hidden';
    }
  }
}
