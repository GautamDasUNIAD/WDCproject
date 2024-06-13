document.addEventListener('DOMContentLoaded', function() {
    function adjustMenuPosition() {

        const navbar = document.getElementById('navbar');
        const menu = document.querySelector('.menu');
        if (navbar && menu && window.matchMedia('(max-width: 768px)').matches) {
            const navbarHeight = navbar.offsetHeight;
            menu.style.top = navbarHeight + 'px';
        }
        else{
            menu.style.top = 0 +'px';
        }
    }
    adjustMenuPosition();

    // Adjust the menu position on window resize
    window.addEventListener('resize', adjustMenuPosition);
});