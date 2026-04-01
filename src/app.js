import { getStockQuote } from './api.js';

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const display = document.getElementById('stockDisplay');
const status = document.getElementById('statusMessage');

searchBtn.addEventListener('click', async () => {
    const symbol = searchInput.value.toUpperCase().trim();
    if (!symbol) return;

    // Milestone 2: Handle loading state
    status.innerHTML = `<p>Searching for ${symbol}...</p>`;
    display.innerHTML = "";

    try {
        const data = await getStockQuote(symbol);
        
        if (data && data["01. symbol"]) {
            status.innerHTML = ""; // Clear loading message
            // Milestone 2: Display fetched data dynamically
            display.innerHTML = `
                <div class="stock-card">
                    <h2>${data["01. symbol"]}</h2>
                    <p class="price">$${parseFloat(data["05. price"]).toFixed(2)}</p>
                    <p class="change">Change: ${data["10. change percent"]}</p>
                </div>
            `;
        } else {
            status.innerHTML = `<p>No data found for "${symbol}".</p>`;
        }
    } catch (err) {
        status.innerHTML = `<p style="color: red;">${err.message}</p>`;
    }
});