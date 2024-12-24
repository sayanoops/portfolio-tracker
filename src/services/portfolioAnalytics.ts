import { Stock } from '../types';
import { StockPrice } from './stockPriceService';

export interface PortfolioMetrics {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  topPerformers: Stock[];
  bottomPerformers: Stock[];
  sectorDistribution: { sector: string; value: number }[];
}

export function calculatePortfolioMetrics(
  stocks: Stock[],
  prices: Map<string, StockPrice>
): PortfolioMetrics {
  const totalValue = stocks.reduce((sum, stock) => {
    const currentPrice = prices.get(stock.symbol)?.price || stock.purchase_price;
    return sum + currentPrice * stock.shares;
  }, 0);

  const performanceData = stocks.map(stock => {
    const currentPrice = prices.get(stock.symbol)?.price || stock.purchase_price;
    const value = currentPrice * stock.shares;
    const change = (currentPrice - stock.purchase_price) / stock.purchase_price;
    return { ...stock, currentValue: value, change };
  });

  const sortedByPerformance = [...performanceData].sort((a, b) => b.change - a.change);

  // Mock sector data (in production, fetch from an API)
  const mockSectors = ['Technology', 'Finance', 'Healthcare', 'Consumer'];
  const sectorDistribution = mockSectors.map(sector => ({
    sector,
    value: totalValue * (Math.random() * 0.5)
  }));

  return {
    totalValue,
    dailyChange: performanceData.reduce((sum, stock) => sum + stock.change, 0),
    dailyChangePercent: (performanceData.reduce((sum, stock) => sum + stock.change, 0) / stocks.length) * 100,
    topPerformers: sortedByPerformance.slice(0, 3),
    bottomPerformers: sortedByPerformance.slice(-3).reverse(),
    sectorDistribution
  };
}