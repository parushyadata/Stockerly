// Get the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_ALPHA_KEY;

export async function getStockQuote(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network issue");
        
        const data = await response.json();
        
        if (data["Note"]) {
            throw new Error("Rate limit reached. Please wait a minute.");
        }
        
        return data["Global Quote"];
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}