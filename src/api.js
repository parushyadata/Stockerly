// Get the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_ALPHA_KEY;

if (!API_KEY) {
    throw new Error(
        'Alpha Vantage API key is not configured. Start the app with Vite so import.meta.env values are loaded.'
    );
}

export async function getStockHistory(symbol) {
    // Using the Daily Time Series endpoint
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Alpha Vantage returns dates as keys, we need to extract the last 7 days of prices
        const timeSeries = data["Time Series (Daily)"];
        const dates = Object.keys(timeSeries).slice(0, 7).reverse();
        const prices = dates.map(date => parseFloat(timeSeries[date]["4. close"]));
        
        return { dates, prices };
    } catch (error) {
        console.error("History Fetch Error:", error);
        return null;
    }
}
export async function getStockQuote(symbol) {
    // 1. The URL
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${import.meta.env.VITE_ALPHA_KEY}`;
    
    // 2. The Fetch
    const response = await fetch(url);
    
    // 3. The Conversion
    const data = await response.json();
    
    // 4. The Delivery
    return data["Global Quote"];
}