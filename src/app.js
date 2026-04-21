import Chart from 'chart.js/auto';
import { getStockQuote } from './api.js';
import { renderAllStocks, sortByPrice, filterExpensive, removeStock, saveToLocal, loadFromLocal,getStockQuote } from './utils.js';

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

let stockList = loadFromLocal(); // Initialize your watchlist from LocalStorage
renderAllStocks(stockList, display); // Render saved stocks immediately on page load

// Step B: Update your search event listener
// Inside your searchBtn event listener in js/app.js
searchBtn.addEventListener('click', async () => {
    const symbol = searchInput.value.toUpperCase().trim();
    
    // ... existing fetch logic for the Quote ...

    if (data && data["01. symbol"]) {
        const newStock = {
            symbol: data["01. symbol"],
            price: parseFloat(data["05. price"]),
            change: data["10. change percent"]
        };

        if (!stockList.some(s => s.symbol === newStock.symbol)) {
            stockList.push(newStock);
            saveToLocal(stockList);
        }

        // 1. First, render the HTML cards (including the <canvas>)
        renderAllStocks(stockList, display);

        // 2. NEW STEP: Loop through your list and initialize the charts
        // We do this AFTER rendering so the <canvas> actually exists in the DOM
        stockList.forEach(stock => {
            initChart(stock.symbol); 
        });
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
    const deleteButton = event.target.closest('.delete-btn');
    if (!deleteButton || !display.contains(deleteButton)) return;

    // Get the symbol from the "data-symbol" attribute we created in utils.js
    const symbol = deleteButton.getAttribute('data-symbol');
    
    // Update our main list using the filter function
    stockList = removeStock(stockList, symbol);
    saveToLocal(stockList);
    
    // Re-render the UI with the updated list
    renderAllStocks(stockList, display);
});
async function initChart(symbol) {
    const history = await getStockHistory(symbol);
    if (!history) return;

    const ctx = document.getElementById(`chart-${symbol}`).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.dates,
            datasets: [{
                label: 'Last 7 Days',
                data: history.prices,
                borderColor: '#4A90E2', // Your signature blue!
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}
// At the bottom of js/app.js for page initialization
window.addEventListener('DOMContentLoaded', () => {
    if (stockList.length > 0) {
        renderAllStocks(stockList, display);
        stockList.forEach(stock => {
            initChart(stock.symbol);
        });
    }
});
// Add this to your existing event listener in js/app.js
display.addEventListener('click', async (event) => {
    const symbol = event.target.getAttribute('data-symbol');

    // Handle Delete (Existing Logic)
    if (event.target.classList.contains('delete-btn')) {
        stockList = removeStock(stockList, symbol);
        saveToLocal(stockList);
        renderAllStocks(stockList, display);
    }

    // NEW: Handle Show Graph
    if (event.target.classList.contains('graph-btn')) {
        const canvas = document.getElementById(`chart-${symbol}`);
        
        // Toggle: If it's already showing, hide it
        if (canvas.style.display === 'block') {
            canvas.style.display = 'none';
            event.target.innerText = 'Show Graph';
            return;
        }

        // Show loading state on button
        const originalText = event.target.innerText;
        event.target.innerText = 'Loading...';

        try {
            // Show the canvas and initialize the chart
            canvas.style.display = 'block';
            await initChart(symbol);
            event.target.innerText = 'Hide Graph';
        } catch (err) {
            event.target.innerText = 'Error';
            console.error(err);
        }
    }
});