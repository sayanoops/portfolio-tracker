import React, { useEffect, useState } from 'react';
import { Stock } from '../types';
import { PortfolioMetrics } from './PortfolioMetrics';
import { stockPriceService, StockPrice } from '../services/stockPriceService';
import { calculatePortfolioMetrics } from '../services/portfolioAnalytics';

interface DashboardProps {
  stocks: Stock[];
}

export function Dashboard({ stocks }: DashboardProps) {
  const [prices, setPrices] = useState<Map<string, StockPrice>>(new Map());

  useEffect(() => {
    const symbols = stocks.map(stock => stock.symbol);
    stockPriceService.startMonitoring(symbols);

    const unsubscribe = stockPriceService.subscribe(newPrices => {
      setPrices(newPrices);
    });

    return () => {
      unsubscribe();
      stockPriceService.stop();
    };
  }, [stocks]);

  const metrics = calculatePortfolioMetrics(stocks, prices);

  return (
    <div className="space-y-6">
      <PortfolioMetrics metrics={metrics} />
    </div>
  );
}