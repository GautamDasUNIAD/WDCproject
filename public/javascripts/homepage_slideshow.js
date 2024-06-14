let slideIndex = 1; // Initialize the slide index to the first slide
showSlides(slideIndex); // Show the first slide initially

// Function to change the slide index and show the corresponding slide
function plusSlides(n) {
    showSlides(slideIndex += n); // Increment or decrement the slide index and show the updated slide
}

// Function to display the slide based on the current slide index
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide"); // Get all elements with the class "slide"

    // If the slide index exceeds the number of slides, reset it to the first slide
    if (n > slides.length) {
        slideIndex = 1;
    }
    // If the slide index is less than 1, set it to the last slide
    if (n < 1) {
        slideIndex = slides.length;
    }
    // Loop through all slides and hide them
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    // Display the current slide
    slides[slideIndex-1].style.display = "block";
}

// Add event listener for the "prev" button to show the previous slide
document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
// Add event listener for the "next" button to show the next slide
document.querySelector('.next').addEventListener('click', () => plusSlides(1));
