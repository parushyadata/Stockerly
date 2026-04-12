# Stockerly: Real-Time Stock Analysis Dashboard

## 📌 Project Overview
Stockerly is a functional web dashboard designed to help users track financial market data. This project demonstrates the ability to handle real-time API integration, persistent data storage, and modular JavaScript architecture.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3 (Grid & Flexbox)
- **Logic:** JavaScript (ES6+), Vite
- **API:** Alpha Vantage
- **Persistence:** LocalStorage API

## ✨ Key Features
- **Real-Time Data:** Fetches live price and change data via the Alpha Vantage Global Quote endpoint.
- **Dynamic Watchlist:** Add and remove stocks from a personalized list.
- **HOF Manipulation:** - `.sort()`: Organize stocks by price (High to Low).
  - `.filter()`: View only premium stocks (> $150) or remove items from the list.
  - `.map()`: Dynamically render stock cards.
- **Persistence:** Your watchlist stays saved in the browser across sessions.

## 🚀 Setup
1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file and add `VITE_ALPHA_KEY=YOUR_API_KEY`.
4. Start the server with `npm run dev`.

## 📂 Project Structure
- `/js/api.js` - API fetch logic.
- `/js/utils.js` - Helper functions (HOFs & LocalStorage).
- `/js/app.js` - Event listeners and UI controller.