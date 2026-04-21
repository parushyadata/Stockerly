import Chart from 'chart.js/auto';
import { getStockQuote, getStockHistory } from './api.js'; // Ensure getStockHistory is exported from api.js
import { renderAllStocks, sortByPrice, filterExpensive, removeStock, saveToLocal, loadFromLocal } from './utils.js';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

// State Management
let stockList = loadFromLocal(); 
const chartInstances = {}; // Track charts to prevent reuse errors

// Initial Render
renderAllStocks(stockList, display);

/** * SEARCH LOGIC
 */
searchBtn.addEventListener('click', async () => {
    const symbol = searchInput.value.toUpperCase().trim();
    if (!symbol) return;

    status.innerHTML = "Fetching market data...";
    
    try {
        const data = await getStockQuote(symbol);
        
        if (data && data["01. symbol"]) {
            const newStock = {
                symbol: data["01. symbol"],
                price: parseFloat(data["05. price"]),
                change: data["10. change percent"]
            };

            // Avoid duplicates
            if (!stockList.some(s => s.symbol === newStock.symbol)) {
                stockList.push(newStock);
                saveToLocal(stockList);
            }

            status.innerHTML = "";
            renderAllStocks(stockList, display);
        }
    } catch (err) {
        status.innerHTML = `<span style="color: #ff6b6b;">${err.message}</span>`;
        console.error("Search Error:", err);
    }
});

/**
 * CHART INITIALIZATION
 */
async function initChart(symbol) {
    const history = await getStockHistory(symbol);
    if (!history) return;

    const canvas = document.getElementById(`chart-${symbol}`);
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (chartInstances[symbol]) {
        chartInstances[symbol].destroy();
    }

    chartInstances[symbol] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.dates,
            datasets: [{
                label: 'Price',
                data: history.prices,
                borderColor: '#4A90E2',
                tension: 0.3,
                fill: false,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

/**
 * EVENT DELEGATION (Remove & Show Graph)
 */
display.addEventListener('click', async (event) => {
    const target = event.target;
    const symbol = target.getAttribute('data-symbol');
    if (!symbol) return;

    // Handle Remove
    if (target.classList.contains('delete-btn')) {
        stockList = removeStock(stockList, symbol);
        saveToLocal(stockList);
        
        // Cleanup chart instance if it exists
        if (chartInstances[symbol]) {
            chartInstances[symbol].destroy();
            delete chartInstances[symbol];
        }
        
        renderAllStocks(stockList, display);
    }

    // Handle Show Graph
    if (target.classList.contains('graph-btn')) {
        const canvas = document.getElementById(`chart-${symbol}`);
        
        if (canvas.style.display === 'block') {
            canvas.style.display = 'none';
            target.innerText = 'Show Graph';
        } else {
            const originalText = target.innerText;
            target.innerText = 'Loading...';
            
            try {
                canvas.style.display = 'block';
                await initChart(symbol);
                target.innerText = 'Hide Graph';
            } catch (err) {
                target.innerText = 'Error';
                console.error(err);
            }
        }
    }
});

/**
 * GLOBAL CONTROLS (Sort/Filter)
 */
document.getElementById('sortBtn').addEventListener('click', () => {
    const sortedData = sortByPrice(stockList);
    renderAllStocks(sortedData, display);
});

document.getElementById('filterBtn').addEventListener('click', () => {
    const filteredData = filterExpensive(stockList);
    renderAllStocks(filteredData, display);
});

document.getElementById('showAllBtn').addEventListener('click', () => {
    renderAllStocks(stockList, display);
});

// Load any existing charts on page load if they were open (Optional)
window.addEventListener('DOMContentLoaded', () => {
    renderAllStocks(stockList, display);
});