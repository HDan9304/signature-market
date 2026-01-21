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
            if (entry.isIntersecting) {
                const index = entry.target.dataset.index;
                // Update dots
                document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
                const dot = document.getElementById(`dot-${index}`);
                if (dot) dot.classList.add('active');
                
                // Set the current promo on the slider for reference
                slider.dataset.activePromo = index;
                filterProductsByPromo(index);
            }
        });
    }, { root: slider, threshold: 0.6 });

    document.querySelectorAll('.promo-card').forEach(card => observer.observe(card));
}

function filterProductsByPromo(promoIndex) {
    const cards = document.querySelectorAll('.product-card');
    if (cards.length === 0) return;

    // Use "0" as default if index is missing to avoid hiding regular products on load
    const activeIndex = promoIndex !== undefined ? promoIndex : (slider.dataset.activePromo || 0);
    const promoID = (parseInt(activeIndex) + 1).toString(); 

    cards.forEach(card => {
        const productPromoID = card.dataset.promo;
        // Show if: No promoID set OR matches current promo
        if (!productPromoID || productPromoID === "undefined" || productPromoID === "" || productPromoID === promoID) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Auto-slide logic with pause-on-hover and arrow support
let autoSlide = setInterval(slideNext, 5000);

function slideNext() {
    const cardWidth = slider.querySelector('.promo-card')?.offsetWidth || 300;
    if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
}

slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
slider.addEventListener('mouseleave', () => autoSlide = setInterval(slideNext, 5000));

document.getElementById('next-promo').addEventListener('click', slideNext);
document.getElementById('prev-promo').addEventListener('click', () => {
    const cardWidth = slider.querySelector('.promo-card')?.offsetWidth || 300;
    slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
});

loadPromos();

// New Folder-Based Product Loader
const productGrid = document.getElementById('product-grid');

// Automated Product Loading with Promotion Linking
let allProducts = []; // Stores all loaded products for filtering

async function loadProducts() {
    productGrid.innerHTML = '';
    const startID = 7549;
    const range = 300;
    
    // Create an array of all fetch promises to run them in parallel
    const fetchPromises = Array.from({ length: range }, (_, index) => {
        const folder = `product${startID + index}`;
        return fetch(`products/${folder}/info.json`)
            .then(response => {
                if (!response.ok) return null;
                return response.json().then(data => ({ ...data, folder }));
            })
            .catch(() => null);
    });

    // Wait for all requests to finish simultaneously
    const results = await Promise.all(fetchPromises);
    
    // Render only the valid products found
    results.forEach(data => {
        if (data) renderProductGrouped(data);
    });

    filterProductsByPromo(slider.dataset.activePromo || 0);
}

function renderProductGrouped(data) {
    const groupName = data.promoName || "Our Products";
    const groupID = groupName.replace(/\s+/g, '-').toLowerCase();
    
    // Find or create the section for this group
    let section = document.getElementById(`section-${groupID}`);
    if (!section) {
        section = document.createElement('div');
        section.className = 'product-group-section';
        section.id = `section-${groupID}`;
        section.innerHTML = `
            <div class="group-header-row">
                <h2 class="group-header">${groupName}</h2>
            </div>
            <div class="manual-slider" id="slider-${groupID}"></div>
            <div class="product-indicators" id="indicators-${groupID}"></div>
        `;
        productGrid.appendChild(section);
    }

    const sliderContainer = section.querySelector('.manual-slider');
    const isOutOfStock = data.stock === 0;
    const card = document.createElement('div');
    card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;
    card.dataset.promo = data.promoID;
    card.dataset.index = sliderContainer.children.length;
    const discount = data.oldPrice ? Math.round(((data.oldPrice - data.price) / data.oldPrice) * 100) : 0;
    card.innerHTML = `
        <div class="product-img-container">
            ${isOutOfStock ? '<div class="out-of-stock-overlay">SOLD OUT</div>' : ''}
            <img src="products/${data.folder}/${data.image}" alt="${data.name}" class="product-img">
        </div>
        <div class="product-info">
            <h4 class="product-name">${data.name}</h4>
            <div class="product-price">
                <span class="current-price">${data.currency} ${data.price}</span>
                <div class="price-discount-row">
                    ${data.oldPrice ? `<span class="slash-price">${data.currency} ${data.oldPrice}</span>` : ''}
                    ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                </div>
            </div>
            <button class="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''}>
                ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `;
    sliderContainer.appendChild(card);

    // Create dot
    const indicatorContainer = section.querySelector('.product-indicators');
    const dot = document.createElement('div');
    dot.className = 'p-dot';
    dot.id = `p-dot-${groupID}-${card.dataset.index}`;
    indicatorContainer.appendChild(dot);

    // Initialize observer specifically for this group's cards
    const pObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = entry.target.dataset.index;
                section.querySelectorAll('.p-dot').forEach(d => d.classList.remove('active'));
                const targetDot = document.getElementById(`p-dot-${groupID}-${idx}`);
                if (targetDot) targetDot.classList.add('active');
            }
        });
    }, { root: sliderContainer, threshold: 0.6 });
    
    pObserver.observe(card);

    // Inject See All button if items exceed 5
    if (sliderContainer.children.length > 5) {
        let seeAllBtn = section.querySelector('.see-all-btn');
        if (!seeAllBtn) {
            seeAllBtn = document.createElement('button');
            seeAllBtn.className = 'see-all-btn';
            seeAllBtn.innerText = 'See All';
            seeAllBtn.onclick = () => {
                // Navigate to a dedicated category page with parameters
                window.location.href = `category.html?name=${encodeURIComponent(groupName)}&id=${data.promoID}`;
            };
            section.querySelector('.group-header-row').appendChild(seeAllBtn);
        }
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