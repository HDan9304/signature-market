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

initSearch();