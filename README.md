# 🌱 Linas Matkasse - Frontend

Web3 frontend for supply chain tracking and eco-loyalty token management.

## 🚀 Quick Start

1. **Open locally:**
```bash
   start index.html
```

2. **Configure blockchain connection:**
   Edit `js/config.js` with deployed contract addresses.

3. **Connect MetaMask:**
   - Switch to Polygon Amoy testnet
   - Get testnet MATIC from faucet
   - Connect wallet in the app

## 📁 Project Structure
```
linas-matkasse-frontend/
├── index.html          # Landing page
├── scanner.html        # QR scanner & product history
├── wallet.html         # Token balance & redemption
├── products.html       # Product catalog
├── css/
│   └── style.css       # Custom styles
└── js/
    ├── config.js       # Contract addresses & ABIs
    ├── blockchain.js   # Ethers.js wrapper
    ├── scanner.js      # QR scanning logic
    ├── wallet.js       # Wallet interaction
    └── products.js     # Product listing
```

## 🛠️ Tech Stack

- Vanilla JavaScript (no build process)
- Ethers.js v5
- Tailwind CSS (CDN)
- html5-qrcode library

## 🌐 Deployment

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📝 Configuration

Update `js/config.js` with your deployed contract addresses:
```javascript
const CONTRACTS = {
    PRODUCT_REGISTRY: "0xYourAddress",
    ECO_TOKEN: "0xYourAddress",
    REWARD_MANAGER: "0xYourAddress",
};
```

## 🔗 Links

- **Smart Contracts:** [GitHub Repo]
- **Backend API:** [If applicable]
- **Documentation:** [Docs URL]

## 🔗 Smart Contracts

**Contracts Repository:** https://github.com/MaxWK96/linas-matkasse-contracts  
**Deployed Contracts (Polygon Amoy):**
- ProductRegistry: `0x055d83CFE46E15349613566c8ddB065b4E1D57a5`
- EcoLoyaltyToken: `0x083ba3725f579FFeB01297Cb9A33bBc5Be4d16ff`
- RewardManager: `0x49E5DF81AE16Ec73b40dD9EA6C22e8513D327e50`