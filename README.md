# PhotoPay (frontend)

A lightweight React + Vite frontend for PhotoPay — a decentralized marketplace for digital photography powered by Solana.

## What this project is
- A single-page React app (Vite) that lets users browse, create, and purchase digital art listings.
- Uses Phantom wallet for payments and signing, with on-chain purchases handled via Solana.

## User flow (high level)
1. Browse listings on the Explore page ([`pages.Explore`](src/pages/Explore.jsx)).
2. Click a listing to view details ([`pages.ListingDetail`](src/pages/ListingDetail.jsx)).
3. Connect Phantom wallet (managed in [`context.WalletContext.WalletProvider`](src/context/WalletContext.jsx)).
4. Initiate a purchase — backend prepares transaction data via [`utils.photopayAPI.initiatePurchase`](src/utils/api.js).
5. Sign & send the transaction via Phantom (implemented in [`context.WalletContext.signAndSendTransaction`](src/context/WalletContext.jsx)).
6. Backend confirms and user is redirected to the success screen ([`pages.PurchaseSuccess`](src/pages/PurchaseSuccess.jsx)).

## Key files / symbols
- App entry & routing: [`App`](src/App.jsx)  
- Wallet provider & signing logic: [`WalletContext.WalletProvider`](src/context/WalletContext.jsx)  
- API helper: [`photopayAPI`](src/utils/api.js) — e.g. [`photopayAPI.getAllListings`](src/utils/api.js), [`photopayAPI.createListing`](src/utils/api.js)  
- Pages: [`pages.Home`](src/pages/Home.jsx), [`pages.Explore`](src/pages/Explore.jsx), [`pages.CreateListing`](src/pages/CreateListing.jsx), [`pages.ListingDetail`](src/pages/ListingDetail.jsx), [`pages.PurchaseSuccess`](src/pages/PurchaseSuccess.jsx)  
- Reusable UI: [`components.ui.Button`](src/components/ui/Button.jsx), [`components.Navbar`](src/components/Navbar.jsx), [`components.ListingCard`](src/components/ListingCard.jsx), [`components.Loader`](src/components/Loader.jsx), [`components.Footer`](src/components/Footer.jsx)

## Notable packages used
- React + React DOM — UI
- Vite — bundler / dev server
- Tailwind CSS — utility-first styling (see `tailwind.config.js` and `src/index.css`)
- Framer Motion — animations (used across pages/components)
- axios — API calls (wrapped in [`src/utils/api.js`](src/utils/api.js))
- lucide-react — icons
- sonner — toast notifications
- canvas-confetti — purchase success celebration
- @solana/web3.js — building & sending Solana transactions

## Quick start
- Install deps: `npm install`  
- Run dev server: `npm run dev`  
- Serve backend at the URL configured in `.env` (VITE_API_URL) or change `BASE_URL` in [`src/utils/api.js`](src/utils/api.js).

## Helpful links (workspace files)
- [.env](.env)  
- [.gitignore](.gitignore)  
- [index.html](index.html)  
- [package.json](package.json)  
- [postcss.config.js](postcss.config.js)  
- [tailwind.config.js](tailwind.config.js)  
- [vite.config.js](vite.config.js)  
- [README.md](README.md)  

- src:
  - [src/App.jsx](src/App.jsx)
  - [src/main.jsx](src/main.jsx)
  - [src/index.css](src/index.css)
  - [src/utils/api.js](src/utils/api.js)
  - [src/context/WalletContext.jsx](src/context/WalletContext.jsx)
  - pages:
    - [src/pages/Home.jsx](src/pages/Home.jsx)
    - [src/pages/Explore.jsx](src/pages/Explore.jsx)
    - [src/pages/CreateListing.jsx](src/pages/CreateListing.jsx)
    - [src/pages/ListingDetail.jsx](src/pages/ListingDetail.jsx)
    - [src/pages/PurchaseSuccess.jsx](src/pages/PurchaseSuccess.jsx)
  - components:
    - [src/components/Navbar.jsx](src/components/Navbar.jsx)
    - [src/components/Footer.jsx](src/components/Footer.jsx)
    - [src/components/ListingCard.jsx](src/components/ListingCard.jsx)
    - [src/components/Loader.jsx](src/components/Loader.jsx)
    - ui:
      - [src/components/ui/Button.jsx](src/components/ui/Button.jsx)

