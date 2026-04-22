// Get the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_ALPHA_KEY;

if (!API_KEY) {
    throw new Error(
        'Alpha Vantage API key is not configured. Start the app with Vite so import.meta.env values are loaded.'
    );
}

// Ensure this is in js/api.js
export async function getStockHistory(symbol) {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data["Time Series (Daily)"]) return null;

    const timeSeries = data["Time Series (Daily)"];
    // Get all dates, reverse them so they go left-to-right (oldest to newest)
    const allDates = Object.keys(timeSeries).reverse();
    const allPrices = allDates.map(date => parseFloat(timeSeries[date]["4. close"]));
    
    return { allDates, allPrices };
}
export async function getStockQuote(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // ERROR HANDLING: If the API sends a "Note" or "Information" instead of the Quote
    if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
        console.error("API Error:", data);
        throw new Error(data["Note"] || data["Information"] || `No quote returned for ${symbol}.`);
    }

    return data["Global Quote"];
}