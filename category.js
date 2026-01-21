const urlParams = new URLSearchParams(window.location.search);
const catName = urlParams.get('name') || "Products";
const promoID = urlParams.get('id');

document.getElementById('category-title').innerText = catName;
const grid = document.getElementById('category-grid');

async function loadCategoryProducts() {
    const startID = 7549;
    const range = 300;
    
    const fetchPromises = Array.from({ length: range }, (_, index) => {
        const folder = `product${startID + index}`;
        return fetch(`products/${folder}/info.json`)
            .then(res => res.ok ? res.json().then(d => ({ ...d, folder })) : null)
            .catch(() => null);
    });

    const results = await Promise.all(fetchPromises);
    let count = 0;
    
    results.forEach(data => {
        if (data && data.promoID === promoID) {
            // Using Number() ensures both "0" and 0 trigger the out-of-stock state
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
                    <button class="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            `;
            // Applying your staggered Wave animation
            card.style.animation = `gridReveal 0.5s ${count * 0.05}s cubic-bezier(0.2, 0.8, 0.2, 1) both`;
            grid.appendChild(card);
            count++;
        }
    });
}

loadCategoryProducts();