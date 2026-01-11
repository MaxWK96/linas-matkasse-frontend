// Blockchain interaction layer
// Handles provider setup, wallet connections, and contract calls

let provider = null;
let signer = null;
let userAddress = null;
let contracts = {
    productRegistry: null,
    ecoToken: null,
    rewardManager: null
};

async function initReadOnlyProvider() {
    try {
        provider = new ethers.providers.JsonRpcProvider(getRpcUrl());
        console.log("Read-only provider initialized");
        return provider;
    } catch (error) {
        console.error("Failed to init provider:", error);
        throw error;
    }
}

async function initContracts() {
    if (!provider) {
        await initReadOnlyProvider();
    }

    try {
        contracts.productRegistry = new ethers.Contract(
            CONTRACTS.PRODUCT_REGISTRY,
            PRODUCT_REGISTRY_ABI,
            provider
        );

        contracts.ecoToken = new ethers.Contract(
            CONTRACTS.ECO_TOKEN,
            ECO_TOKEN_ABI,
            provider
        );

        contracts.rewardManager = new ethers.Contract(
            CONTRACTS.REWARD_MANAGER,
            REWARD_MANAGER_ABI,
            provider
        );

        console.log("Contracts initialized");
        return contracts;
    } catch (error) {
        console.error("Failed to init contracts:", error);
        throw error;
    }
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask är inte installerad! Installera från metamask.io');
            throw new Error('MetaMask not installed');
        }

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        userAddress = accounts[0];
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        const network = await provider.getNetwork();
        const expectedChainId = getChainId();

        if (network.chainId !== expectedChainId) {
            await switchNetwork();
        }

        await initContractsWithSigner();
        console.log("Wallet connected:", userAddress);
        return userAddress;

    } catch (error) {
        console.error("Failed to connect wallet:", error);
        throw error;
    }
}

async function switchNetwork() {
    const chainId = getChainId();
    const chainIdHex = '0x' + chainId.toString(16);

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            await addNetwork();
        } else {
            throw switchError;
        }
    }
}

async function addNetwork() {
    const params = CONFIG.NETWORK === "amoy" ? {
        chainId: '0x13882',
        chainName: 'Polygon Amoy Testnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [CONFIG.AMOY_RPC],
        blockExplorerUrls: ['https://amoy.polygonscan.com/']
    } : {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: [CONFIG.POLYGON_RPC],
        blockExplorerUrls: ['https://polygonscan.com/']
    };

    await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
    });
}

async function initContractsWithSigner() {
    contracts.productRegistry = new ethers.Contract(
        CONTRACTS.PRODUCT_REGISTRY,
        PRODUCT_REGISTRY_ABI,
        signer
    );

    contracts.ecoToken = new ethers.Contract(
        CONTRACTS.ECO_TOKEN,
        ECO_TOKEN_ABI,
        signer
    );

    contracts.rewardManager = new ethers.Contract(
        CONTRACTS.REWARD_MANAGER,
        REWARD_MANAGER_ABI,
        signer
    );
}

function isWalletConnected() {
    return userAddress !== null;
}

function getCurrentUserAddress() {
    return userAddress;
}

// Product registry functions
async function getProduct(productId) {
    try {
        if (!contracts.productRegistry) {
            await initContracts();
        }

        if (CONTRACTS.PRODUCT_REGISTRY === "0x0000000000000000000000000000000000000000") {
            console.log("Using demo data (contract not deployed)");
            return getDemoProduct(productId);
        }

        const product = await contracts.productRegistry.products(productId);
        return {
            id: product.id.toNumber(),
            name: product.name,
            category: product.category,
            exists: product.exists
        };
    } catch (error) {
        console.error("Failed to get product:", error);
        return getDemoProduct(productId);
    }
}

async function getProductHistory(productId) {
    try {
        if (!contracts.productRegistry) {
            await initContracts();
        }

        if (CONTRACTS.PRODUCT_REGISTRY === "0x0000000000000000000000000000000000000000") {
            console.log("Using demo data (contract not deployed)");
            return getDemoProductHistory(productId);
        }

        const stages = await contracts.productRegistry.getProductHistory(productId);
        return stages.map(stage => ({
            stageName: stage.stageName,
            timestamp: stage.timestamp.toNumber(),
            location: stage.location,
            actor: stage.actor,
            certificationHash: stage.certificationHash,
            carbonFootprint: stage.carbonFootprint.toNumber()
        }));
    } catch (error) {
        console.error("Failed to get product history:", error);
        return getDemoProductHistory(productId);
    }
}

// Token functions
async function getTokenBalance(address) {
    try {
        if (!contracts.ecoToken) {
            await initContracts();
        }

        if (CONTRACTS.ECO_TOKEN === "0x0000000000000000000000000000000000000000") {
            console.log("Using demo balance (contract not deployed)");
            return 127;
        }

        const balance = await contracts.ecoToken.balanceOf(address);
        return balance.toNumber();
    } catch (error) {
        console.error("Failed to get token balance:", error);
        return 127;
    }
}

async function areTokensExpired(address) {
    try {
        if (!contracts.ecoToken) {
            await initContracts();
        }

        if (CONTRACTS.ECO_TOKEN === "0x0000000000000000000000000000000000000000") {
            return false;
        }

        return await contracts.ecoToken.tokensExpired(address);
    } catch (error) {
        console.error("Failed to check token expiry:", error);
        return false;
    }
}

// Demo data helpers

function getDemoProduct(productId) {
    let key = productId;

    if (typeof productId === 'number') {
        const keys = Object.keys(DEMO_PRODUCTS);
        key = keys[productId - 1] || 'carrot';
    }

    return DEMO_PRODUCTS[key] || DEMO_PRODUCTS['carrot'];
}

function getDemoProductHistory(productId) {
    const product = getDemoProduct(productId);
    return product.stages;
}

// Utility functions
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function daysSince(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    return Math.floor(diff / (60 * 60 * 24));
}

// Listen for wallet events
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            userAddress = null;
            signer = null;
        } else {
            userAddress = accounts[0];
            window.location.reload();
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}