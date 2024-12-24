import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle } from 'lucide-react';
import { StockSymbolSelect } from './StockSymbolSelect';

export function StockForm({ onStockAdded }: { onStockAdded: () => void }) {
  const [symbol, setSymbol] = useState('');
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setError('You must be logged in to add stocks');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('stocks').insert([
      {
        user_id: user.id,
        symbol: symbol.toUpperCase(),
        shares: Number(shares),
        purchase_price: Number(purchasePrice),
        purchase_date: purchaseDate,
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSymbol('');
      setShares('');
      setPurchasePrice('');
      setPurchaseDate('');
      onStockAdded();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <PlusCircle className="h-6 w-6 text-indigo-500 mr-2" />
        <h2 className="text-xl font-semibold">Add New Stock</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Symbol
          </label>
          <StockSymbolSelect
            value={symbol}
            onChange={setSymbol}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shares
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Price
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            required
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Adding...' : 'Add Stock'}
        </button>
      </div>
    </form>
  );
}