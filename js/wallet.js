// Wallet page - displays token balance and transaction history

let userBalance = 0;
let isConnected = false;

document.addEventListener('DOMContentLoaded', async () => {
    await checkConnection();
});

async function checkConnection() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (accounts.length > 0) {
                userAddress = accounts[0];
                await onWalletConnected();
            }
        }
    } catch (error) {
        console.error("Failed to check connection:", error);
    }
}

async function handleConnectWallet() {
    try {
        await connectWallet();
        await onWalletConnected();
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Kunde inte ansluta wallet. Se till att MetaMask är installerad.");
    }
}

async function onWalletConnected() {
    isConnected = true;

    document.getElementById('connect-section').classList.add('hidden');
    document.getElementById('wallet-content').classList.remove('hidden');

    await displayWalletInfo();
    await loadTransactionHistory();
}

async function displayWalletInfo() {
    try {
        const address = getCurrentUserAddress();
        document.getElementById('wallet-address').textContent = address;

        userBalance = await getTokenBalance(address);
        document.getElementById('token-balance').textContent = userBalance;
        document.getElementById('token-value-sek').textContent = userBalance;

        document.getElementById('total-earned').textContent = userBalance + 50;
        document.getElementById('total-redeemed').textContent = 50;
        document.getElementById('eco-score').textContent = Math.floor(userBalance * 1.5);

    } catch (error) {
        console.error("Failed to display wallet info:", error);
    }
}

async function loadTransactionHistory() {
    const container = document.getElementById('transaction-history');

    const demoTransactions = [
        {
            type: 'earned',
            amount: 30,
            reason: 'Köpte ekologiska produkter',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            icon: '🌱'
        },
        {
            type: 'earned',
            amount: 20,
            reason: 'Valde lokala produkter',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            icon: '📍'
        },
        {
            type: 'earned',
            amount: 50,
            reason: 'Låg-koldioxid måltid',
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            icon: '🍃'
        },
        {
            type: 'redeemed',
            amount: -50,
            reason: '50 SEK rabatt inlöst',
            date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
            icon: '🎁'
        },
        {
            type: 'earned',
            amount: 40,
            reason: 'Köpte ekologiska produkter',
            date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
            icon: '🌱'
        }
    ];

    container.innerHTML = '';

    demoTransactions.forEach(tx => {
        const txElement = document.createElement('div');
        txElement.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';

        const isPositive = tx.amount > 0;
        const amountColor = isPositive ? 'text-green-600' : 'text-orange-600';
        const amountPrefix = isPositive ? '+' : '';

        txElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">${tx.icon}</div>
                <div>
                    <p class="font-semibold text-gray-800">${tx.reason}</p>
                    <p class="text-sm text-gray-500">${tx.date.toLocaleDateString('sv-SE')}</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold ${amountColor}">${amountPrefix}${tx.amount} ECO</p>
            </div>
        `;

        container.appendChild(txElement);
    });
}

function redeemTokens(amount, reward) {
    if (userBalance < amount) {
        alert('Du har inte tillräckligt med tokens!');
        return;
    }

    alert(`🎉 Grattis! Du har löst in ${amount} ECO tokens för: ${reward}`);

    userBalance -= amount;
    document.getElementById('token-balance').textContent = userBalance;
    document.getElementById('token-value-sek').textContent = userBalance;
}