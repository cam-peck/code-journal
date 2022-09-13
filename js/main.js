var $journalForm = document.querySelector('form');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');

$photoUrlInput.addEventListener('input', handleImageUrl);

function handleImageUrl(event) {
  if (isImage($photoUrlInput.value)) {
    $image.setAttribute('src', $photoUrlInput.value);
  }
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

$journalForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  var formData = {};
  formData.title = $journalForm.elements.title.value;
  formData['photo-url'] = $journalForm.elements['photo-url'].value;
  formData.notes = $journalForm.elements.notes.value;
  formData.entryID = data.nextEntryId;
  data.nextEntryId++;
  data.entries.unshift(formData);
  $journalForm.reset();
  $image.setAttribute('src', 'images/placeholder-image-square.jpg'); // reset image to default
}
