const grid = document.getElementById('search-results-grid');
const searchInput = document.getElementById('search-input');
const stats = document.getElementById('search-stats');
let allProducts = [];

async function initSearch() {
    const startID = 7549;
    const range = 300;
    
    // Index all products for instant searching
    const fetchPromises = Array.from({ length: range }, (_, index) => {
        const folder = `product${startID + index}`;
        return fetch(`products/${folder}/info.json`)
            .then(res => res.ok ? res.json().then(d => ({ ...d, folder })) : null)
            .catch(() => null);
    });

    allProducts = (await Promise.all(fetchPromises)).filter(p => p !== null);
    stats.innerText = `Search across ${allProducts.length} products`;
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
        grid.innerHTML = '';
        return;
    }
    
    const matches = allProducts.filter(p => p.name.toLowerCase().includes(query));
    renderResults(matches);
});

// Function for Cart Interaction
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalDisplay = document.getElementById('cart-total-price');
const cartCountBadge = document.querySelector('.cart-count');

function getCart() { return JSON.parse(localStorage.getItem('sm_cart') || '[]'); }
function saveCart(cart) { 
    localStorage.setItem('sm_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.innerText = totalCount;
    
    cartItemsContainer.innerHTML = cart.length === 0 ? '<p style="text-align:center;color:#999;margin-top:20px;">Your cart is empty</p>' : '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">RM ${item.price.toFixed(2)}</div>
                <div class="cart-qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
            <button class="action-btn" onclick="changeQty(${index}, -999)"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    cartTotalDisplay.innerText = `RM ${totalPrice.toFixed(2)}`;
}

window.changeQty = (index, delta) => {
    let cart = getCart();
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart(cart);
};

const toggleCart = () => {
    cartDrawer.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    if (cartDrawer.classList.contains('active')) updateCartUI();
};

cartBtn.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
cartOverlay.addEventListener('click', toggleCart);

function renderResults(products) {
    grid.innerHTML = '';
    stats.innerText = `Found ${products.length} results`;
    
    products.forEach((data, index) => {
        const isOutOfStock = Number(data.stock) === 0;
        const card = document.createElement('div');
        card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;
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
            </div>
        `;
        card.style.animation = `gridReveal 0.4s ${index * 0.03}s ease-out both`;
        grid.appendChild(card);
    });
}

// Updated Add to Cart Listener
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const card = e.target.closest('.product-card');
        const product = {
            name: card.querySelector('.product-name').innerText,
            price: parseFloat(card.querySelector('.current-price').innerText.replace(/[^\d.]/g, '')),
            img: card.querySelector('.product-img').src,
            qty: 1
        };
        
        let cart = getCart();
        const existing = cart.find(item => item.name === product.name);
        if (existing) existing.qty++; else cart.push(product);
        
        saveCart(cart);
        toggleCart(); // Open cart to show item added
    }
});

updateCartUI(); // Initialize on load

initSearch();