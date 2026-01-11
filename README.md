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