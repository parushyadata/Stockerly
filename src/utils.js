// This file is not currently used - app.js is loaded directly in index.html
// Keeping as placeholder for future expansion
// Function to generate the HTML for your stocks
// Inside js/utils.js
export function renderAllStocks(stocks, container) {
    if (stocks.length === 0) {
        container.innerHTML = "<p>Your watchlist is empty.</p>";
        return;
    }

  // Inside js/utils.js
container.innerHTML = stocks.map(stock => `
    <div class="stock-card">
        <h3>${stock.symbol}</h3>
        <p class="price">$${stock.price.toFixed(2)}</p>
        
        <canvas id="chart-${stock.symbol}" style="display: none; width: 100%; height: 150px;"></canvas>
        
        <div class="card-actions">
            <button class="graph-btn" data-symbol="${stock.symbol}">Show Graph</button>
            <button class="delete-btn" data-symbol="${stock.symbol}">Remove</button>
        </div>
    </div>
`).join('');
}

// HOF: .sort() - Organizes data by price
export function sortByPrice(stocks) {
    return [...stocks].sort((a, b) => b.price - a.price);
}

// HOF: .filter() - Shows only "Premium" stocks
export function filterExpensive(stocks) {
    return stocks.filter(stock => stock.price > 150);
}
// HOF: .filter() - Removes a specific stock from the array
export function removeStock(stocks, symbolToRemove) {
    return stocks.filter(stock => stock.symbol !== symbolToRemove);
}
// Save the current watchlist to LocalStorage
export function saveToLocal(stocks) {
    localStorage.setItem('stockerlyy_watchlist', JSON.stringify(stocks));
}

// Load the watchlist from LocalStorage
export function loadFromLocal() {
    const saved = localStorage.getItem('stockerlyy_watchlist');
    return saved ? JSON.parse(saved) : [];
}