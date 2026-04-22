import Chart from 'chart.js/auto';
import { getStockQuote, getStockHistory } from './api.js';
import { renderAllStocks, sortByPrice, filterExpensive, removeStock, saveToLocal, loadFromLocal } from './utils.js';

// DOM Elements
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

// State Management
// At the top of app.js
const fullDataCache = {}; 
const chartInstances = {};

// 1. Update the Click Listener for "Show Graph"
display.addEventListener('click', async (event) => {
    const target = event.target;
    const symbol = target.getAttribute('data-symbol');
    if (!symbol) return;

    if (target.classList.contains('graph-btn')) {
        const canvas = document.getElementById(`chart-${symbol}`);
        const sliderCont = document.getElementById(`slider-cont-${symbol}`);

        if (canvas.style.display === 'block') {
            canvas.style.display = 'none';
            sliderCont.style.display = 'none';
            target.innerText = 'Show Graph';
        } else {
            target.innerText = 'Loading...';
            // Only fetch if NOT in cache to save API credits
            if (!fullDataCache[symbol]) {
                fullDataCache[symbol] = await getStockHistory(symbol);
            }
            
            if (fullDataCache[symbol]) {
                canvas.style.display = 'block';
                sliderCont.style.display = 'block';
                renderChart(symbol, 7); // Default view is 7 days
                target.innerText = 'Hide Graph';
            }
        }
    }
    // ... include your existing delete logic here ...
});

// 2. Add the Slider Input Listener
display.addEventListener('input', (event) => {
    if (event.target.classList.contains('date-slider')) {
        const symbol = event.target.getAttribute('data-symbol');
        const days = parseInt(event.target.value);
        
        // Update the number label in UI
        document.getElementById(`val-${symbol}`).innerText = days;
        
        // Redraw chart using cached data (no API call)
        renderChart(symbol, days);
    }
});

// 3. Optimized Chart Rendering Function
function renderChart(symbol, days) {
    const data = fullDataCache[symbol];
    const ctx = document.getElementById(`chart-${symbol}`).getContext('2d');

    if (chartInstances[symbol]) {
        chartInstances[symbol].destroy();
    }

    chartInstances[symbol] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.allDates.slice(-days), // Slice the last X days
            datasets: [{
                data: data.allPrices.slice(-days),
                borderColor: '#4A90E2',
                tension: 0.2,
                pointRadius: days > 50 ? 0 : 2, // Hide dots if too many days
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}
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

