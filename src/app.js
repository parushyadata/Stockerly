import Chart from 'chart.js/auto';
import { getStockQuote, getStockHistory } from './api.js';
import { renderAllStocks, sortByPrice, filterExpensive, removeStock, saveToLocal, loadFromLocal } from './utils.js';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

// State Management
let stockList = loadFromLocal(); 
const chartInstances = {}; // Track Chart.js objects to prevent reuse errors

// Initial Render
renderAllStocks(stockList, display);

/**
 * SEARCH LOGIC
 */
searchBtn.addEventListener('click', async () => {
    const symbol = searchInput.value.toUpperCase().trim();
    if (!symbol) return;

    status.innerHTML = "Connecting to market server...";
    
    try {
        const data = await getStockQuote(symbol);
        
        if (data && data["01. symbol"]) {
            const newStock = {
                symbol: data["01. symbol"],
                price: parseFloat(data["05. price"]),
                change: data["10. change percent"]
            };

            // Prevent duplicate entries in watchlist
            if (!stockList.some(s => s.symbol === newStock.symbol)) {
                stockList.push(newStock);
                saveToLocal(stockList);
            }

            status.innerHTML = "";
            renderAllStocks(stockList, display);
        }
    } catch (err) {
        // Displays API errors (like rate limits) directly to the user
        status.innerHTML = `<span style="color: #ff6b6b;">${err.message}</span>`;
        console.error("Search Error:", err);
    }
});

/**
 * CHART INITIALIZATION
 * Fetches 7-day history and renders a line chart
 */
async function initChart(symbol) {
    const history = await getStockHistory(symbol);
    if (!history) return;

    const canvas = document.getElementById(`chart-${symbol}`);
    const ctx = canvas.getContext('2d');

    // Important: Destroy existing chart instance before creating a new one
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
                borderColor: '#4A90E2', // Your signature blue
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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

    // Handle Delete
    if (target.classList.contains('delete-btn')) {
        stockList = removeStock(stockList, symbol);
        saveToLocal(stockList);
        
        if (chartInstances[symbol]) {
            chartInstances[symbol].destroy();
            delete chartInstances[symbol];
        }
        
        renderAllStocks(stockList, display);
    }

    // Handle Show Graph (Toggle)
    if (target.classList.contains('graph-btn')) {
        const canvas = document.getElementById(`chart-${symbol}`);
        
        if (canvas.style.display === 'block') {
            canvas.style.display = 'none';
            target.innerText = 'Show Graph';
        } else {
            target.innerText = 'Loading History...';
            try {
                canvas.style.display = 'block';
                await initChart(symbol);
                target.innerText = 'Hide Graph';
            } catch (err) {
                target.innerText = 'Error Loading';
                console.error(err);
            }
        }
    }
});

