let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    if (n > slides.length) {slideIndex = 1;}
    if (n < 1) {slideIndex = slides.length;}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
}

document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
document.querySelector('.next').addEventListener('click', () => plusSlides(1));

// Get the button
var mybutton = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}


// Smooth Scrolling
mybutton.onclick = function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

//Instant Scrolling
// // When the user clicks on the button, scroll to the top of the document
// mybutton.onclick = function() {
//     document.body.scrollTop = 0; // For Safari
//     document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
// };
