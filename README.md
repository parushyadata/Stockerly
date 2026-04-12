# Stockerly: Real-Time Stock Analysis Dashboard

### 🌐 [Live Demo: stockerly1.vercel.app](https://stockerly1.vercel.app/)

## 📌 Project Overview
Stockerly is a high-performance web dashboard built to track financial market data in real-time. This project highlights the intersection of **Software Development** and **Visual Literacy**, providing a clean, dark-themed interface for monitoring stocks, managing a personal watchlist, and analyzing data through JavaScript manipulation.

## 🛠️ Technical Stack
- **Frontend Framework:** Vite (Fast build tool & dev server)
- **Logic:** Vanilla JavaScript (ES6+) with Modular Architecture
- **Styling:** CSS3 (Modern Grid/Flexbox with Dark Mode UI)
- **API:** Alpha Vantage Financial API
- **Deployment:** Vercel (CI/CD Integrated)

## ✨ Core Features
- **Real-Time Market Data:** Integrated Alpha Vantage `GLOBAL_QUOTE` endpoint to fetch the latest price and percentage change.
- **Persistent Watchlist:** Uses **LocalStorage** to ensure your saved stocks remain on the dashboard even after a page refresh.
- **Data Manipulation (HOFs):** - `.sort()`: Reorders your watchlist by price (High to Low).
  - `.filter()`: Powering the "Premium" filter (Price > $150) and the "Remove" functionality.
  - `.map()`: Dynamically generating the UI cards from the stock data array.
- **Visual Design:** A mobile-responsive grid layout featuring a deep-navy aesthetic with high-contrast blue accents and card-hover effects.

## 📂 Modular File Structure
- `js/api.js`: Handles all `fetch()` requests and environment variable security.
- `js/utils.js`: Contains all logic for Array Higher-Order Functions and LocalStorage persistence.
- `js/app.js`: The central controller managing event listeners and DOM updates.
- `index.html` & `style.css`: The structural and visual backbone of the application.

