// Get the API key from Vite's environment variables
const API_KEY = import.meta.env.VITE_ALPHA_KEY;

if (!API_KEY) {
    throw new Error(
        'Alpha Vantage API key is not configured. Start the app with Vite so import.meta.env values are loaded.'
    );
}

export async function getStockQuote(symbol) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    console.debug('[Stockerly] Fetching URL:', url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network issue: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.debug('[Stockerly] API response:', data);

        if (data.Note) {
            throw new Error('Rate limit reached. Please wait a minute.');
        }

        if (data['Error Message']) {
            throw new Error('Invalid symbol or API request. Check the ticker and try again.');
        }

        const quote = data['Global Quote'];
        if (!quote || Object.keys(quote).length === 0) {
            throw new Error(`No quote returned for ${symbol}.`);
        }

        return quote;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}