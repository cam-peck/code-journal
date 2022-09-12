var $photoUrlInput = document.querySelector('#photo-url');
var $image = document.querySelector('img');

$photoUrlInput.addEventListener('input', handleImageUrl);

function handleImageUrl(event) {
  $image.setAttribute('src', $photoUrlInput.value);
}
