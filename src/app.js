import { getStockQuote } from './api.js';
import { renderAllStocks, sortByPrice, filterExpensive } from './utils.js';
import { removeStock } from './utils.js';
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

let stockList = []; // This stores your watchlist

// Step B: Update your search event listener
searchBtn.addEventListener('click', async () => {
    const symbol = searchInput.value.toUpperCase().trim();
    if (!symbol) return;

    try {
        const data = await getStockQuote(symbol);
        
        if (data && data["01. symbol"]) {
            // Check if stock is already in list to avoid duplicates
            if (!stockList.some(s => s.symbol === data["01. symbol"])) {
                // Add the new stock object to our array
                stockList.push({
                    symbol: data["01. symbol"],
                    price: parseFloat(data["05. price"]),
                    change: data["10. change percent"]
                });
            }
            renderAllStocks(stockList, display); // Render the whole list
        }
    } catch (err) {
        console.error(err);
    }
});

// 1. Handling the Sort Button
document.getElementById('sortBtn').addEventListener('click', () => {
    const sortedData = sortByPrice(stockList);
    renderAllStocks(sortedData, display);
});

// 2. Handling the Filter Button
document.getElementById('filterBtn').addEventListener('click', () => {
    const filteredData = filterExpensive(stockList);
    renderAllStocks(filteredData, display);
});

// 3. Handling the "Show All" Button
document.getElementById('showAllBtn').addEventListener('click', () => {
    renderAllStocks(stockList, display);
});
display.addEventListener('click', (event) => {
    // Check if what was clicked is actually a delete button
    if (event.target.classList.contains('delete-btn')) {
        // Get the symbol from the "data-symbol" attribute we created in utils.js
        const symbol = event.target.getAttribute('data-symbol');
        
        // Update our main list using the filter function
        stockList = removeStock(stockList, symbol);
        
        // Re-render the UI with the updated list
        renderAllStocks(stockList, display);
    }
});