import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { PortfolioMetrics as Metrics } from '../services/portfolioAnalytics';

interface PortfolioMetricsProps {
  metrics: Metrics;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PortfolioMetrics({ metrics }: PortfolioMetricsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Portfolio Overview</h3>
          <DollarSign className="h-6 w-6 text-green-500" />
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">${metrics.totalValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Daily Change</p>
            <p className={`text-lg font-semibold ${metrics.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {metrics.dailyChange >= 0 ? '+' : ''}{metrics.dailyChangePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sector Distribution</h3>
          <PieChartIcon className="h-6 w-6 text-blue-500" />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={metrics.sectorDistribution}
                dataKey="value"
                nameKey="sector"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {metrics.sectorDistribution.map((entry, index) => (
                  <Cell key={entry.sector} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Performers</h3>
          <TrendingUp className="h-6 w-6 text-green-500" />
        </div>
        <div className="space-y-2">
          {metrics.topPerformers.map(stock => (
            <div key={stock.id} className="flex justify-between items-center">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-green-500">+{(stock.change * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Bottom Performers</h3>
          <TrendingDown className="h-6 w-6 text-red-500" />
        </div>
        <div className="space-y-2">
          {metrics.bottomPerformers.map(stock => (
            <div key={stock.id} className="flex justify-between items-center">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-red-500">{(stock.change * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}