// Product catalog page

let allProducts = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    await initReadOnlyProvider();
    await loadProducts();
});

async function loadProducts() {
    try {
        allProducts = Object.entries(DEMO_PRODUCTS).map(([key, product]) => ({
            ...product,
            key: key,
            price: Math.floor(Math.random() * 50) + 20,
            image: `https://via.placeholder.com/300x200/16a34a/ffffff?text=${encodeURIComponent(product.name)}`
        }));

        displayProducts(allProducts);

    } catch (error) {
        console.error("Failed to load products:", error);
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-3 text-center py-16 text-gray-500">
                Inga produkter hittades med dessa filter.
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer';

    let tokensEarned = 0;
    if (product.isEcoCertified) tokensEarned += 10;
    if (product.isLocal) tokensEarned += 10;
    if (product.carbonFootprint < 150) tokensEarned += 30;

    card.innerHTML = `
        <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="absolute top-2 right-2 flex flex-col space-y-1">
                ${product.isEcoCertified ? '<span class="badge badge-eco">✓ Eko</span>' : ''}
                ${product.isLocal ? '<span class="badge badge-local">📍 Lokal</span>' : ''}
                ${product.carbonFootprint < 150 ? '<span class="badge badge-low-carbon">🌱 Låg CO₂</span>' : ''}
            </div>
        </div>
        <div class="p-4">
            <h3 class="text-xl font-bold text-green-800 mb-2">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-3">${product.category} • ${product.region}</p>

            <div class="flex justify-between items-center mb-3">
                <div>
                    <p class="text-2xl font-bold text-green-600">${product.price} SEK</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Tjäna</p>
                    <p class="text-lg font-bold text-green-600">+${tokensEarned} ECO</p>
                </div>
            </div>

            <div class="flex space-x-2">
                <button onclick="viewProductDetails('${product.key}')"
                        class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold">
                    Se Resa
                </button>
                <button onclick="addToCart('${product.key}')"
                        class="flex-1 bg-white text-green-600 px-4 py-2 rounded-lg border-2 border-green-600 hover:bg-green-50 transition text-sm font-semibold">
                    Lägg till
                </button>
            </div>

            <div class="mt-3 pt-3 border-t border-gray-200">
                <p class="text-xs text-gray-500 flex items-center">
                    <span class="mr-2">🌍</span>
                    ${product.carbonFootprint}g CO₂ • ${product.stages.length} spårade steg
                </p>
            </div>
        </div>
    `;

    return card;
}

function filterProducts(filter) {
    currentFilter = filter;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-green-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeBtn = document.querySelector(`button[onclick="filterProducts('${filter}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-green-600', 'text-white');
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }

    let filtered = allProducts;

    if (filter === 'eco') {
        filtered = allProducts.filter(p => p.isEcoCertified);
    } else if (filter === 'local') {
        filtered = allProducts.filter(p => p.isLocal);
    } else if (filter === 'low-carbon') {
        filtered = allProducts.filter(p => p.carbonFootprint < 150);
    }

    displayProducts(filtered);
}

function viewProductDetails(productKey) {
    window.location.href = `scanner.html?product=${productKey}`;
}

function addToCart(productKey) {
    const product = allProducts.find(p => p.key === productKey);
    alert(`🛒 "${product.name}" tillagd i varukorgen!`);
}