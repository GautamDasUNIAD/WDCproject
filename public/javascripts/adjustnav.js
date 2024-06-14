document.addEventListener('DOMContentLoaded', function() {
    // Function to adjust the menu position based on the navbar height
    function adjustMenuPosition() {
        // Get the navbar and menu elements
        const navbar = document.getElementById('navbar');
        const menu = document.querySelector('.menu');

        // Check if both elements exist and the window width is 768px or less
        if (navbar && menu && window.matchMedia('(max-width: 768px)').matches) {
            // Get the height of the navbar
            const navbarHeight = navbar.offsetHeight;
            // Set the top position of the menu to the height of the navbar
            menu.style.top = navbarHeight + 'px';
        } else {
            // If the window width is more than 768px, reset the top position of the menu
            menu.style.top = 0 + 'px';
        }
    }

    // Call the function to adjust the menu position on page load
    adjustMenuPosition();

    // Add an event listener to adjust the menu position on window resize
    window.addEventListener('resize', adjustMenuPosition);
});
