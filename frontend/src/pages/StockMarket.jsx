import React, { useState, useEffect } from 'react';
import { TrendingUp, Percent, ArrowUpRight, Plus, Trash2, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const StockMarket = () => {
  const [stockHoldings, setStockHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Demat Details States
  const [dpId, setDpId] = useState(() => localStorage.getItem('wealth_demat_dp_id') || '');
  const [mobileNum, setMobileNum] = useState(() => localStorage.getItem('wealth_demat_mobile') || '');
  const [editingDemat, setEditingDemat] = useState(false);
  const [tempDpId, setTempDpId] = useState('');
  const [tempMobile, setTempMobile] = useState('');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStocks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/investments', { params: { type: 'stock' } });
      setStockHoldings(res.data);
    } catch (err) {
      console.error('Error fetching stocks:', err.message);
      setError('Failed to fetch stock holdings from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    setError('');
    if (!ticker || !quantity || !avgPrice || !currentPrice) return;

    setSubmitting(true);
    const qty = parseInt(quantity);
    const avg = parseFloat(avgPrice);
    const cur = parseFloat(currentPrice);

    try {
      await axiosClient.post('/investments', {
        name: ticker.toUpperCase() + (companyName ? ` - ${companyName}` : ''),
        type: 'stock',
        amount: avg, // buy price average
        quantity: qty,
        currentValue: cur // last traded price
      });

      setTicker('');
      setCompanyName('');
      setQuantity('');
      setAvgPrice('');
      setCurrentPrice('');
      setShowForm(false);
      fetchStocks();
    } catch (err) {
      console.error('Error saving stock:', err.message);
      setError('Failed to save stock holding');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStock = async (id) => {
    setError('');
    try {
      await axiosClient.delete(`/investments/${id}`);
      fetchStocks();
    } catch (err) {
      console.error('Error deleting stock:', err.message);
      setError('Failed to delete stock holding');
    }
  };

  // Calculations
  const totalInvested = stockHoldings.reduce((acc, curr) => acc + (curr.quantity * curr.amount), 0);
  const totalCurrentValue = stockHoldings.reduce((acc, curr) => acc + (curr.quantity * (curr.currentValue || curr.amount)), 0);
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

      {/* Demat Details Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="text-blue-600 w-4 h-4" /> Demat Account Credentials
          </h3>
          {!editingDemat && (
            <button
              onClick={() => {
                setTempDpId(dpId);
                setTempMobile(mobileNum);
                setEditingDemat(true);
              }}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              {dpId || mobileNum ? 'Edit Demat Info' : 'Add Demat Info'}
            </button>
          )}
        </div>

        {editingDemat ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDpId(tempDpId);
              setMobileNum(tempMobile);
              localStorage.setItem('wealth_demat_dp_id', tempDpId);
              localStorage.setItem('wealth_demat_mobile', tempMobile);
              setEditingDemat(false);
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
          >
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">DP ID (Demat Account No.)</label>
              <input
                type="text"
                placeholder="e.g. 1208160001234567"
                value={tempDpId}
                onChange={(e) => setTempDpId(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demat Registered Mobile</label>
              <input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={tempMobile}
                onChange={(e) => setTempMobile(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg cursor-pointer"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingDemat(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1 font-medium">
            <span>DP ID: <strong className="text-slate-800">{dpId || 'Not linked'}</strong></span>
            <span>Mobile: <strong className="text-slate-800">{mobileNum || 'Not linked'}</strong></span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Stock Holding'
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
          <span className="text-slate-500 text-sm font-semibold">Loading stock holdings...</span>
        </div>
      ) : (
        <>
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
                  stockHoldings.map((stock) => {
                    const buyPrice = stock.amount;
                    const curPrice = stock.currentValue || buyPrice;
                    const percentDiff = ((curPrice - buyPrice) / buyPrice) * 100;
                    const isPositive = percentDiff >= 0;

                    // Parse name/ticker
                    const nameParts = stock.name.split(' - ');
                    const tickerDisplay = nameParts[0];
                    const compNameDisplay = nameParts[1] || '';

                    return (
                      <tr key={stock._id} className="table-row">
                        <td className="p-4 flex flex-col">
                          <span className="font-semibold text-slate-800 text-sm">{tickerDisplay}</span>
                          {compNameDisplay && <span className="text-[10px] text-slate-500">{compNameDisplay}</span>}
                        </td>
                        <td className="p-4 text-sm text-slate-700">{stock.quantity}</td>
                        <td className="p-4 text-sm text-slate-700">₹{buyPrice.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-sm text-slate-700 font-semibold">₹{curPrice.toLocaleString('en-IN')}</td>
                        <td className={`p-4 text-sm font-semibold ${isPositive ? 'text-blue-600' : 'text-sky-600'}`}>
                          {isPositive ? '+' : ''}{percentDiff.toFixed(1)}%
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteStock(stock._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StockMarket;