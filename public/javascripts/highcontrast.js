
const sliderElement = document.querySelector('.slider.round');
function toggleDarkMode() {
  const bodyElement = document.body;
  bodyElement.classList.toggle('dark-mode'); // Add/remove 'dark-mode' class
}
sliderElement.addEventListener('click', toggleDarkMode);
