let img_c;
let image;
const imageContainer = document.querySelector(".modal .container__image");

function openCropImageModal() {
  document.getElementById("cropImageModal").style.display = "block";

  image = document.querySelector(".foreGraph img");
  if (img_c) img_c.setImage(image.src);
  else img_c = new ImageCropper(".modal .container__image", image.src);
}

function cropImage() {
  document.getElementById("cropImageModal").style.display = "none";
  let img_b64_str = img_c.crop("image/png", 1);
  image.src = img_b64_str;
}

function closeModal() {
  document.getElementById("cropImageModal").style.display = "none";
}

// Get the modal
var modal = document.getElementById('cropImageModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
    modal.style.display = "none";
    }
}