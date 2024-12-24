import { getQuote, Quote } from './finnhub';

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
}

class StockPriceService {
  private subscribers: ((prices: Map<string, StockPrice>) => void)[] = [];
  private prices: Map<string, StockPrice> = new Map();
  private interval: NodeJS.Timer | null = null;

  async startMonitoring(symbols: string[]) {
    // Initial fetch
    await this.fetchPrices(symbols);

    // Update every minute
    this.interval = setInterval(() => {
      this.fetchPrices(symbols);
    }, 60000);
  }

  private async fetchPrices(symbols: string[]) {
    try {
      const quotes = await Promise.all(
        symbols.map(async (symbol) => {
          const quote = await getQuote(symbol);
          return { symbol, quote };
        })
      );

      quotes.forEach(({ symbol, quote }) => {
        this.prices.set(symbol, this.convertQuoteToPrice(symbol, quote));
      });

      this.notifySubscribers();
    } catch (error) {
      console.error('Error fetching stock prices:', error);
    }
  }

  private convertQuoteToPrice(symbol: string, quote: Quote): StockPrice {
    return {
      symbol,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      volume: 0, // Finnhub doesn't provide volume in quote endpoint
      high: quote.h,
      low: quote.l
    };
  }

  subscribe(callback: (prices: Map<string, StockPrice>) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.prices));
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export const stockPriceService = new StockPriceService();