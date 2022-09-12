var $journalForm = document.querySelector('form');
var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');

$photoUrlInput.addEventListener('input', handleImageUrl);

function handleImageUrl(event) {
  $image.setAttribute('src', $photoUrlInput.value);
}

$journalForm.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  var formData = {};
  formData.title = $journalForm.elements.title.value;
  formData['photo-url'] = $journalForm.elements['photo-url'].value;
  formData.notes = $journalForm.elements.notes.value;
  $journalForm.reset();
  $image.setAttribute('src', 'images/placeholder-image-square.jpg');
}
