import React, { useState } from 'react';
import { TrendingUp, Percent, ArrowUpRight, Plus, Trash2, Lightbulb } from 'lucide-react';

const StockMarket = () => {
  const [stockHoldings, setStockHoldings] = useState(() => {
    return JSON.parse(localStorage.getItem('wealth_stocks')) || [];
  });

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');

  const saveStocks = (stocks) => {
    setStockHoldings(stocks);
    localStorage.setItem('wealth_stocks', JSON.stringify(stocks));
  };

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!ticker || !quantity || !avgPrice || !currentPrice) return;

    const qty = parseInt(quantity);
    const avg = parseFloat(avgPrice);
    const cur = parseFloat(currentPrice);
    const percentDiff = ((cur - avg) / avg) * 100;
    const pnlSign = percentDiff >= 0 ? '+' : '';

    const newStock = {
      id: Date.now(),
      ticker: ticker.toUpperCase(),
      name: companyName || `${ticker.toUpperCase()} India`,
      qty: qty,
      avgPrice: avg,
      currentPrice: cur,
      pnl: `${pnlSign}${percentDiff.toFixed(1)}%`,
    };

    saveStocks([...stockHoldings, newStock]);
    setTicker('');
    setCompanyName('');
    setQuantity('');
    setAvgPrice('');
    setCurrentPrice('');
    setShowForm(false);
  };

  const handleDeleteStock = (id) => {
    saveStocks(stockHoldings.filter(stock => stock.id !== id));
  };

  // Calculations
  const totalInvested = stockHoldings.reduce((acc, curr) => acc + (curr.qty * curr.avgPrice), 0);
  const totalCurrentValue = stockHoldings.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalGainLoss = totalCurrentValue - totalInvested;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600 w-7 h-7" />
            Stock Market Portfolio
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor your equity share investments, average buying price, and unrealized gains.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Add Holding'}
        </button>
      </div>

      {/* Add New Stock Form */}
      {showForm && (
        <form onSubmit={handleAddStock} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Stock Holding Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Ticker Symbol</label>
              <input
                type="text"
                placeholder="e.g. INFY"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Infosys Ltd."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Quantity</label>
              <input
                type="number"
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Avg. Purchase Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1400"
                value={avgPrice}
                onChange={(e) => setAvgPrice(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Current Price (₹)</label>
              <input
                type="number"
                placeholder="e.g. 1450"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              Save Stock Holding
            </button>
          </div>
        </form>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Equity Invested Value</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalInvested.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            Total Unrealized Returns: {totalGainLoss >= 0 ? '+' : ''}₹{totalGainLoss.toLocaleString('en-IN')}.00
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Portfolio Value</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalCurrentValue.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium">
            Dynamic live valuation based on current holdings
          </p>
        </div>
      </div>

      {/* Guidelines Panel */}
      <div className="guideline-box">
        <h3 className="guideline-title">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          Equity Investing Guidelines
        </h3>
        <ul className="guideline-list">
          <li className="guideline-item">
            <strong>Risk Tolerance</strong>: Equities offer high potential returns but come with <strong>high market volatility</strong>.
          </li>
          <li className="guideline-item">
            <strong>Fundamental Analysis</strong>: Research a company's <strong>debt, earnings growth, and management quality</strong> before buying.
          </li>
          <li className="guideline-item">
            <strong>Long-term Outlook</strong>: Avoid panic-selling during market dips; focus on <strong>long-term wealth creation</strong>.
          </li>
          <li className="guideline-item">
            <strong>Stop-Loss Strategy</strong>: Define a <strong>maximum tolerable loss threshold</strong> to protect your trading capital.
          </li>
        </ul>
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
              <th className="table-header-cell">Profit / Loss</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stockHoldings.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                  No stock holdings registered. Click "Add Holding" to populate your portfolio.
                </td>
              </tr>
            ) : (
              stockHoldings.map((stock) => (
                <tr key={stock.id} className="table-row">
                  <td className="p-4 flex flex-col">
                    <span className="font-semibold text-slate-800 text-sm">{stock.ticker}</span>
                    <span className="text-[10px] text-slate-500">{stock.name}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-700">{stock.qty}</td>
                  <td className="p-4 text-sm text-slate-700">₹{stock.avgPrice.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-sm text-slate-700 font-semibold">₹{stock.currentPrice.toLocaleString('en-IN')}</td>
                  <td className={`p-4 text-sm font-semibold \${stock.pnl.startsWith('+') ? 'text-blue-600' : 'text-sky-600'}`}>
                    {stock.pnl}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteStock(stock.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMarket;