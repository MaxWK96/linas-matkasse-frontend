// Network and contract configuration

const CONFIG = {
    POLYGON_RPC: "https://polygon-rpc.com",
    POLYGON_CHAIN_ID: 137,
    AMOY_RPC: "https://rpc-amoy.polygon.technology",
    AMOY_CHAIN_ID: 80002,
    NETWORK: "amoy",
};

const CONTRACTS = {
    PRODUCT_REGISTRY: "0x055d83CFE46E15349613566c8ddB065b4E1D57a5",
    ECO_TOKEN: "0x083ba3725f579FFeB01297Cb9A33bBc5Be4d16ff",
    REWARD_MANAGER: "0x49E5DF81AE16Ec73b40dD9EA6C22e8513D327e50",
};

const PRODUCT_REGISTRY_ABI = [
    "function products(uint256) view returns (uint256 id, string name, string category, bytes32 dataHash, bool exists)",
    "function productStages(uint256, uint256) view returns (string stageName, uint256 timestamp, string location, address actor, bytes32 certificationHash, uint256 carbonFootprint)",
    "function getProductHistory(uint256 productId) view returns (tuple(string stageName, uint256 timestamp, string location, address actor, bytes32 certificationHash, uint256 carbonFootprint)[])",
    "function registerProduct(string name, string category, bytes32 dataHash) returns (uint256)",
    "function addStage(uint256 productId, string stageName, string location, bytes32 certHash, uint256 carbonFootprint)",
    "event ProductRegistered(uint256 indexed productId, string name)",
    "event StageAdded(uint256 indexed productId, string stageName, uint256 timestamp)"
];

const ECO_TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function mint(address user, uint256 amount, string reason)",
    "function burn(address user, uint256 amount, string redemption)",
    "function tokensExpired(address user) view returns (bool)",
    "function tokenExpiryTimestamp(address) view returns (uint256)",
    "event TokensMinted(address indexed user, uint256 amount, string reason)",
    "event TokensBurned(address indexed user, uint256 amount, string redemption)"
];

const REWARD_MANAGER_ABI = [
    "function rewardRules(string) view returns (string actionType, uint256 tokenAmount, bool active)",
    "function issueReward(address user, string actionType)",
    "function issueRewardsBatch(address user, string[] actionTypes)",
    "function setRewardRule(string actionType, uint256 tokenAmount, bool active)",
    "event RewardRuleUpdated(string actionType, uint256 tokenAmount)",
    "event RewardIssued(address indexed user, string actionType, uint256 amount)"
];

// Demo data for testing

const DEMO_PRODUCTS = {
    'carrot': {
        id: 1,
        name: "Ekologisk Morot",
        category: "Grönsaker",
        isEcoCertified: true,
        isLocal: true,
        region: "Skåne",
        carbonFootprint: 120,
        stages: [
            {
                stageName: "Odlad",
                timestamp: Math.floor((Date.now() - 70 * 24 * 60 * 60 * 1000) / 1000),
                location: "Skåne, Sverige",
                actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                certificationHash: "0x1234...",
                carbonFootprint: 50
            },
            {
                stageName: "Skördad",
                timestamp: Math.floor((Date.now() - 6 * 24 * 60 * 60 * 1000) / 1000),
                location: "Skåne, Sverige",
                actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                certificationHash: "0x5678...",
                carbonFootprint: 20
            },
            {
                stageName: "Transporterad till Lager",
                timestamp: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000),
                location: "Helsingborg, Sverige",
                actor: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
                certificationHash: "0x9abc...",
                carbonFootprint: 30
            },
            {
                stageName: "Levererad",
                timestamp: Math.floor((Date.now() - 3 * 24 * 60 * 60 * 1000) / 1000),
                location: "Stockholm, Sverige",
                actor: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
                certificationHash: "0xdef0...",
                carbonFootprint: 20
            }
        ]
    },
    'potato': {
        id: 2,
        name: "Ekologisk Potatis",
        category: "Grönsaker",
        isEcoCertified: true,
        isLocal: true,
        region: "Småland",
        carbonFootprint: 95,
        stages: [
            {
                stageName: "Odlad",
                timestamp: Math.floor((Date.now() - 80 * 24 * 60 * 60 * 1000) / 1000),
                location: "Småland, Sverige",
                actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                certificationHash: "0x1111...",
                carbonFootprint: 40
            },
            {
                stageName: "Skördad",
                timestamp: Math.floor((Date.now() - 12 * 24 * 60 * 60 * 1000) / 1000),
                location: "Småland, Sverige",
                actor: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
                certificationHash: "0x2222...",
                carbonFootprint: 15
            },
            {
                stageName: "Transporterad till Lager",
                timestamp: Math.floor((Date.now() - 11 * 24 * 60 * 60 * 1000) / 1000),
                location: "Jönköping, Sverige",
                actor: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
                certificationHash: "0x3333...",
                carbonFootprint: 25
            },
            {
                stageName: "Levererad",
                timestamp: Math.floor((Date.now() - 10 * 24 * 60 * 60 * 1000) / 1000),
                location: "Göteborg, Sverige",
                actor: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
                certificationHash: "0x4444...",
                carbonFootprint: 15
            }
        ]
    },
    'tomato': {
        id: 3,
        name: "Ekologisk Tomat",
        category: "Grönsaker",
        isEcoCertified: true,
        isLocal: false,
        region: "Spanien",
        carbonFootprint: 450,
        stages: [
            {
                stageName: "Odlad",
                timestamp: Math.floor((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000),
                location: "Almería, Spanien",
                actor: "0x123456789abcdef...",
                certificationHash: "0xaaaa...",
                carbonFootprint: 80
            },
            {
                stageName: "Skördad",
                timestamp: Math.floor((Date.now() - 8 * 24 * 60 * 60 * 1000) / 1000),
                location: "Almería, Spanien",
                actor: "0x123456789abcdef...",
                certificationHash: "0xbbbb...",
                carbonFootprint: 20
            },
            {
                stageName: "Transporterad till Sverige",
                timestamp: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000),
                location: "Malmö, Sverige",
                actor: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
                certificationHash: "0xcccc...",
                carbonFootprint: 320
            },
            {
                stageName: "Levererad",
                timestamp: Math.floor((Date.now() - 3 * 24 * 60 * 60 * 1000) / 1000),
                location: "Stockholm, Sverige",
                actor: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
                certificationHash: "0xdddd...",
                carbonFootprint: 30
            }
        ]
    }
};

function getRpcUrl() {
    return CONFIG.NETWORK === "amoy" ? CONFIG.AMOY_RPC : CONFIG.POLYGON_RPC;
}

function getChainId() {
    return CONFIG.NETWORK === "amoy" ? CONFIG.AMOY_CHAIN_ID : CONFIG.POLYGON_CHAIN_ID;
}