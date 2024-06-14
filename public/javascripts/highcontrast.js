// Get the checkbox input element
const checkboxElement = document.querySelector('.switch input[type="checkbox"]');

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Add/remove 'dark-mode' class to the body

    const currentBackground = getComputedStyle(document.documentElement).getPropertyValue('--primary-background').trim();

    if (currentBackground === '#f6f9f8') {
        // Switch to dark mode colors
        document.documentElement.style.setProperty('--primary-background', '#393639'); // Dark Brown
        document.documentElement.style.setProperty('--secondary-background', '#575657'); // Dark Orange
        document.documentElement.style.setProperty('--primary-text', '#ec538d'); // Light Beige
        document.documentElement.style.setProperty('--secondary-text', '#fad420'); // Light Orange
        document.documentElement.style.setProperty('--primary-button', '#fad420'); // Bright Orange
        document.documentElement.style.setProperty('--secondary-button', '#ec538d'); // Dark Orange
        document.documentElement.style.setProperty('--accent-color', '#1699e7'); // Light Orange
    } else {
        // Switch to light mode colors
        document.documentElement.style.setProperty('--primary-background', '#f6f9f8'); // Light Beige
        document.documentElement.style.setProperty('--secondary-background', '#d5d9dc'); // Light Orange
        document.documentElement.style.setProperty('--primary-text', '#084479'); // Dark Brown
        document.documentElement.style.setProperty('--secondary-text', '#fa5366'); // Dark Orange
        document.documentElement.style.setProperty('--primary-button', '#fa5366'); // Bright Orange
        document.documentElement.style.setProperty('--secondary-button', '#084479'); // Dark Orange
        document.documentElement.style.setProperty('--accent-color', '#084479'); // Light Orange
    }


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
    // Switch to dark mode colors
    document.documentElement.style.setProperty('--primary-background', '#393639'); // Dark Brown
    document.documentElement.style.setProperty('--secondary-background', '#575657'); // Dark Orange
    document.documentElement.style.setProperty('--primary-text', '#ec538d'); // Light Beige
    document.documentElement.style.setProperty('--secondary-text', '#fad420'); // Light Orange
    document.documentElement.style.setProperty('--primary-button', '#fad420'); // Bright Orange
    document.documentElement.style.setProperty('--secondary-button', '#ec538d'); // Dark Orange
    document.documentElement.style.setProperty('--accent-color', '#1699e7'); // Light Orange
}

// Apply slider state if the preference is set
checkboxElement.checked = sliderState;

// Add event listener to the checkbox input element
checkboxElement.addEventListener('change', toggleDarkMode);
