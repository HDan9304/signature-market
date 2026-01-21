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
    const indicatorContainer = document.getElementById('promo-indicators');
    let i = 1;
    let found = true;
    while (found && i < 10) {
        const fileName = `promo${i}.gif`;
        try {
            const response = await fetch(fileName, { method: 'HEAD' });
            if (response.ok) {
                // Create Card
                const card = document.createElement('div');
                card.className = 'promo-card';
                card.dataset.index = i - 1;
                card.innerHTML = `<img src="${fileName}" class="promo-img" alt="Promo">`;
                slider.appendChild(card);
                
                // Create Indicator Dot
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.id = `dot-${i - 1}`;
                indicatorContainer.appendChild(dot);
                
                i++;
            } else { found = false; }
        } catch (e) { found = false; }
    }
    initObserver();
}

function initObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = entry.target.dataset.index;
            const dot = document.getElementById(`dot-${index}`);
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (dot) dot.classList.add('active');
            } else {
                entry.target.classList.remove('active');
                if (dot) dot.classList.remove('active');
            }
        });
    }, { root: slider, threshold: 0.6 });

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

// New Folder-Based Product Loader
const productGrid = document.getElementById('product-grid');

// List your product folder names here
const productFolders = ['Roasted-Almonds', 'Cashew-Mix']; 

async function loadProducts() {
    productGrid.innerHTML = ''; // Clear current grid
    
    for (const folder of productFolders) {
        try {
            const response = await fetch(`products/${folder}/info.json`);
            const data = await response.json();
            
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-container">
                    <img src="products/${folder}/${data.image}" alt="${data.name}" class="product-img">
                </div>
                <div class="product-info">
                    <h4 class="product-name">${data.name}</h4>
                    <div class="product-price">
                        <span class="current-price">${data.currency} ${data.price}</span>
                        <span class="slash-price">${data.currency} ${data.oldPrice}</span>
                    </div>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(card);
        } catch (e) { console.error(`Error loading product: ${folder}`, e); }
    }
}

// Updated Add to Cart Listener
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productName = e.target.closest('.product-card').querySelector('.product-name').innerText;
        alert(`${productName} added to cart!`);
    }
});

loadProducts();