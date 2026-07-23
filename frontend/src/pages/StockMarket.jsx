import React from 'react';
import { TrendingUp, Percent, ArrowUpRight } from 'lucide-react';

const StockMarket = () => {
  const stockHoldings = [
    { id: 1, ticker: 'RELIANCE', name: 'Reliance Industries Ltd.', qty: 12, avgPrice: 2350, currentPrice: 2465, pnl: '+4.9%' },
    { id: 2, ticker: 'TCS', name: 'Tata Consultancy Services', qty: 5, avgPrice: 3100, currentPrice: 3240, pnl: '+4.5%' },
    { id: 3, ticker: 'HDFCBANK', name: 'HDFC Bank Ltd.', qty: 25, avgPrice: 1520, currentPrice: 1495, pnl: '-1.6%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="text-blue-600 w-7 h-7" />
          Stock Market Portfolio
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor your equity share investments, average buying price, and unrealized gains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Equity Invested Value</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹81,824.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            Total Unrealized Returns: +₹3,176.00
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Profit & Loss</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹1,240.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium">
            Daily change: +1.52% overall market gain
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Stock Holdings</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Company / Ticker</th>
              <th className="table-header-cell">Quantity</th>
              <th className="table-header-cell">Avg. Cost</th>
              <th className="table-header-cell">Last Traded Price</th>
              <th className="table-header-cell text-right">Profit / Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stockHoldings.map((stock) => (
              <tr key={stock.id} className="table-row">
                <td className="p-4 flex flex-col">
                  <span className="font-semibold text-slate-800 text-sm">{stock.ticker}</span>
                  <span className="text-[10px] text-slate-500">{stock.name}</span>
                </td>
                <td className="p-4 text-sm text-slate-700">{stock.qty}</td>
                <td className="p-4 text-sm text-slate-700">₹{stock.avgPrice}</td>
                <td className="p-4 text-sm text-slate-700 font-semibold">₹{stock.currentPrice}</td>
                <td className={`p-4 text-sm font-semibold text-right \${stock.pnl.startsWith('+') ? 'text-blue-600' : 'text-sky-600'}`}>{stock.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMarket;