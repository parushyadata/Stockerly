// This file is not currently used - app.js is loaded directly in index.html
// Keeping as placeholder for future expansion
// Function to generate the HTML for your stocks
export function renderAllStocks(stocks, container) {
    if (stocks.length === 0) {
        container.innerHTML = "<p>Your watchlist is empty. Search for a stock to add it!</p>";
        return;
    }

    container.innerHTML = stocks.map(stock => `
        <div class="stock-card">
            <h3>${stock.symbol}</h3>
            <p>Price: $${stock.price.toFixed(2)}</p>
            <p>Change: ${stock.change}</p>
            <button class="delete-btn" data-symbol="${stock.symbol}">Remove</button>
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