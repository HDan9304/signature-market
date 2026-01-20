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

const slider = document.getElementById('promo-slider');

// Option A: Automate file detection (Checking for promo1.gif, promo2.gif, etc.)
async function loadPromos() {
    let i = 1;
    let found = true;
    while (found && i < 10) { // Checks up to 10 files
        const fileName = `promo${i}.gif`;
        try {
            const response = await fetch(fileName, { method: 'HEAD' });
            if (response.ok) {
                const card = document.createElement('div');
                card.className = 'promo-card';
                card.innerHTML = `<img src="${fileName}" class="promo-img" alt="Promo">`;
                slider.appendChild(card);
                i++;
            } else { found = false; }
        } catch (e) { found = false; }
    }
    initObserver(); // Start scaling logic
}

// Scaling Logic: Detects which card is in the center
function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
            else entry.target.classList.remove('active');
        });
    }, { root: slider, threshold: 0.8 });

    document.querySelectorAll('.promo-card').forEach(card => observer.observe(card));
}

// Auto-slide to next center card
setInterval(() => {
    const cardWidth = slider.querySelector('.promo-card')?.offsetWidth + 10 || 300;
    if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
}, 5000);

loadPromos();