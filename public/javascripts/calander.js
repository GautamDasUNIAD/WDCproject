let nav = 0; // Variable to track navigation through months
let clicked = null; // Variable to track the clicked date (not used in this snippet)
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []; // Load events from local storage or initialize an empty array

const calendar = document.getElementById('calendar'); // Get the calendar element from the DOM
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']; // Array of weekday names

// Function to load the calendar
function load() {
    const dt = new Date(); // Create a new Date object for the current date

    // Adjust the date based on the navigation value
    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate(); // Get the current day
    const month = dt.getMonth(); // Get the current month
    const year = dt.getFullYear(); // Get the current year

    const firstDayOfMonth = new Date(year, month, 1); // Create a Date object for the first day of the month
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get the number of days in the current month

    // Create a date string for the first day of the month
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]); // Calculate the number of padding days before the first day of the month

    // Update the month display element with the current month and year
    document.getElementById('monthDisplay').innerHTML =
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = ''; // Clear the calendar element

    // Loop through each day of the month (including padding days)
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div'); // Create a new div element for each day
        daySquare.classList.add('day'); // Add the 'day' class to the div

        // Check if the current loop index is greater than the padding days
        if (i > paddingDays) {
            daySquare.innerHTML = i - paddingDays; // Set the innerHTML to the day number
            daySquare.addEventListener('click', () => console.log('click')); // Add a click event listener to the day square (for future implementation)
        } else {
            daySquare.classList.add('padding'); // Add the 'padding' class to the padding days
        }

        calendar.appendChild(daySquare); // Append the day square to the calendar element
    }
}

// Function to close the new event modal (not fully implemented in this snippet)
function closeModal() {
    document.getElementById('newEventModal').style.display = 'none'; // Hide the modal element
}

// Add event listener for the 'next month' button
document.getElementById('nextMonth').addEventListener('click', () => {
    nav++; // Increment the navigation value
    load(); // Reload the calendar
});

// Add event listener for the 'previous month' button
document.getElementById('prevMonth').addEventListener('click', () => {
    nav--; // Decrement the navigation value
    load(); // Reload the calendar
});

// Initial load of the calendar
load();
