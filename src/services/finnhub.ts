export interface Quote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

export async function getQuote(symbol: string): Promise<Quote> {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }
  
  return response.json();
}