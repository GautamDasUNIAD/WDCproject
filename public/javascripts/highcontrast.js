// Get the checkbox input element
const checkboxElement = document.querySelector('.switch input[type="checkbox"]');

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Add/remove 'dark-mode' class to the body

    // Store the dark mode preference in local storage
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));

    // Store the slider state in local storage
    localStorage.setItem('sliderState', checkboxElement.checked);
}

// Check if dark mode preference is stored in local storage
const isDarkMode = localStorage.getItem('darkMode') === 'true';
const sliderState = localStorage.getItem('sliderState') === 'true';

// Apply dark mode if the preference is set
if (isDarkMode) {
    document.body.classList.add('dark-mode');
}

// Apply slider state if the preference is set
checkboxElement.checked = sliderState;

// Add event listener to the checkbox input element
checkboxElement.addEventListener('change', toggleDarkMode);
