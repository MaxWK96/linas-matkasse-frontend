// QR scanner and product history viewer

let html5QrCode = null;
let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
    await initReadOnlyProvider();
    startQrScanner();
});

function startQrScanner() {
    html5QrCode = new Html5Qrcode("qr-reader");

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
    };

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error("Failed to start scanner:", err);
        alert("Kunde inte starta kameran. Försök med manuell inmatning istället.");
    });
}

function onScanSuccess(decodedText) {
    html5QrCode.stop().then(() => {
        loadProduct(decodedText);
    }).catch(err => {
        console.error("Failed to stop scanner:", err);
    });
}

function onScanError() {
    // Ignore scanning errors
}

async function loadProduct(productIdOrKey) {
    try {
        showLoading();

        const product = await getProduct(productIdOrKey);
        const stages = await getProductHistory(productIdOrKey);

        currentProduct = { ...product, stages };
        displayProduct(currentProduct);

    } catch (error) {
        console.error("Failed to load product:", error);
        alert("Kunde inte ladda produktinformation. Försök igen.");
    }
}

function displayProduct(product) {
    document.getElementById('product-history').classList.remove('hidden');
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;

    displayBadges(product);
    displayStages(product.stages);
    displayEnvironmentalImpact(product);
}

function displayBadges(product) {
    const badgesContainer = document.getElementById('product-badges');
    badgesContainer.innerHTML = '';

    if (product.isEcoCertified) {
        badgesContainer.innerHTML += `<span class="badge badge-eco">✓ Ekologisk</span>`;
    }

    if (product.isLocal) {
        badgesContainer.innerHTML += `<span class="badge badge-local">📍 Lokal</span>`;
    }

    if (product.carbonFootprint < 150) {
        badgesContainer.innerHTML += `<span class="badge badge-low-carbon">🌱 Låg CO₂</span>`;
    }
}

function displayStages(stages) {
    const container = document.getElementById('stages-container');
    container.innerHTML = '';

    stages.forEach((stage, index) => {
        const stageElement = document.createElement('div');
        stageElement.className = 'stage-item';

        const stageIcon = document.createElement('div');
        stageIcon.className = 'stage-icon';
        stageIcon.textContent = index + 1;

        stageElement.innerHTML = `
            <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-semibold text-green-800">${stage.stageName}</h4>
                    <span class="text-sm text-gray-500">${formatDate(stage.timestamp)}</span>
                </div>
                <div class="space-y-1 text-sm text-gray-600">
                    <p><strong>📍 Plats:</strong> ${stage.location}</p>
                    <p><strong>🌱 CO₂:</strong> ${stage.carbonFootprint}g</p>
                    <p><strong>👤 Aktör:</strong> ${formatAddress(stage.actor)}</p>
                    ${stage.certificationHash ? `<p><strong>✓ Certifiering:</strong> Verifierad</p>` : ''}
                </div>
            </div>
        `;

        stageElement.prepend(stageIcon);
        container.appendChild(stageElement);
    });
}

function displayEnvironmentalImpact(product) {
    const totalCarbon = product.stages.reduce((sum, stage) =>
        sum + stage.carbonFootprint, 0
    );

    document.getElementById('total-carbon').textContent = totalCarbon;

    const estimatedDistance = Math.round(totalCarbon / 10);
    document.getElementById('total-distance').textContent = estimatedDistance;

    if (product.stages.length >= 2) {
        const harvestStage = product.stages.find(s => s.stageName.includes('Skördad'));
        const deliveryStage = product.stages[product.stages.length - 1];

        if (harvestStage && deliveryStage) {
            const days = Math.floor(
                (deliveryStage.timestamp - harvestStage.timestamp) / (60 * 60 * 24)
            );
            document.getElementById('total-time').textContent = days;
        } else {
            document.getElementById('total-time').textContent = '-';
        }
    }
}

function showLoading() {
    console.log("Loading product...");
}

function loadProductManually() {
    const input = document.getElementById('manual-product-id');
    const productId = input.value.trim();

    if (!productId) {
        alert('Vänligen ange ett produkt-ID');
        return;
    }

    loadProduct(productId);
}

function loadDemoProduct(productKey) {
    loadProduct(productKey);
}