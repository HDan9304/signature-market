// Function to handle the Mobile Burger Menu
const mobileMenu = document.getElementById('mobile-menu');
const searchBtn = document.getElementById('search-btn');
const cartBtn = document.getElementById('cart-btn');

mobileMenu.addEventListener('click', () => {
    console.log("Burger menu clicked: Opening navigation...");
    // You can add logic here to toggle a sidebar or dropdown
    alert("Mobile Menu Opened");
});

// Function for Search Interaction
searchBtn.addEventListener('click', () => {
    console.log("Search initiated");
    alert("Search bar expanding...");
});

// Function for Cart Interaction
cartBtn.addEventListener('click', () => {
    console.log("Viewing cart");
    alert("Opening Shopping Cart");
});

// Auto-slide functionality for Promotions
const slider = document.getElementById('promo-slider');
let isDown = false;
let startX;
let scrollLeft;

// Basic Auto-scroll every 5 seconds
setInterval(() => {
    if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: 300, behavior: 'smooth' });
    }
}, 5000);