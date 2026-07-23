import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, Calendar, ArrowUpRight, Plus, Trash2, Lightbulb } from 'lucide-react';

const MutualFunds = () => {
  const [activeSips, setActiveSips] = useState(() => {
    return JSON.parse(localStorage.getItem('wealth_sips')) || [];
  });

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [fundName, setFundName] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [yieldPercent, setYieldPercent] = useState('');

  // Persist state updates to localStorage
  const saveSips = (sips) => {
    setActiveSips(sips);
    localStorage.setItem('wealth_sips', JSON.stringify(sips));
  };

  const handleAddSip = (e) => {
    e.preventDefault();
    if (!fundName || !sipAmount) return;

    const newSip = {
      id: Date.now(),
      name: fundName,
      amount: parseFloat(sipAmount),
      frequency: 'Monthly',
      nextDate: nextDate || 'TBD',
      yield: yieldPercent ? `+${yieldPercent}% annualized` : '+12.0% annualized',
    };

    saveSips([...activeSips, newSip]);
    setFundName('');
    setSipAmount('');
    setNextDate('');
    setYieldPercent('');
    setShowForm(false);
  };

  const handleDeleteSip = (id) => {
    saveSips(activeSips.filter(sip => sip.id !== id));
  };

  // Calculations
  const totalSip = activeSips.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMfValue = totalSip; // Starts empty and reflects user input only

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-blue-600 w-7 h-7" />
            Mutual Funds & SIPs
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Track your systemic investment plans and mutual fund holdings.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Add New SIP'}
        </button>
      </div>

      {/* Add New SIP Form */}
      {showForm && (
        <form onSubmit={handleAddSip} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New SIP Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Fund Name</label>
              <input
                type="text"
                placeholder="e.g. Midcap Opportunity Fund"
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">SIP Amount (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={sipAmount}
                onChange={(e) => setSipAmount(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Next Installment Date</label>
              <input
                type="text"
                placeholder="e.g. Aug 15, 2026"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Expected Annual Yield (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 15.5"
                value={yieldPercent}
                onChange={(e) => setYieldPercent(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              Save Investment SIP
            </button>
          </div>
        </form>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Mutual Fund Value</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalMfValue.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            Includes ₹{totalSip.toLocaleString('en-IN')} monthly active SIP contributions
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Monthly SIP</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalSip.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Accumulated monthly investment commitment
          </p>
        </div>
      </div>

      {/* Guidelines Panel */}
      <div className="guideline-box">
        <h3 className="guideline-title">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          SIP & Mutual Fund Guidelines
        </h3>
        <ul className="guideline-list">
          <li className="guideline-item">
            <strong>Compounding Effect</strong>: Start early to allow your <strong>returns to reinvest</strong> and grow exponentially over time.
          </li>
          <li className="guideline-item">
            <strong>Rupee Cost Averaging</strong>: Monthly SIPs buy <strong>more units when prices are low</strong> and fewer units when they are high.
          </li>
          <li className="guideline-item">
            <strong>Expense Ratio</strong>: Choose mutual funds with a <strong>lower expense ratio</strong> to keep more of your earnings.
          </li>
          <li className="guideline-item">
            <strong>Lock-in Period</strong>: Check if the fund has an <strong>exit load</strong> or is a tax-saving ELSS fund with a <strong>3-year lock-in</strong>.
          </li>
        </ul>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Active SIPs</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Fund Name</th>
              <th className="table-header-cell">SIP Amount</th>
              <th className="table-header-cell">Frequency</th>
              <th className="table-header-cell">Next Date</th>
              <th className="table-header-cell">Performance</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeSips.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                  No active SIP investments registered. Click "Add New SIP" to populate your portfolio.
                </td>
              </tr>
            ) : (
              activeSips.map((sip) => (
                <tr key={sip.id} className="table-row">
                  <td className="p-4 font-medium text-slate-800 text-sm">{sip.name}</td>
                  <td className="p-4 text-sm text-slate-700 font-semibold">₹{sip.amount.toLocaleString('en-IN')}</td>
                  <td className="table-cell">{sip.frequency}</td>
                  <td className="p-4 text-sm text-slate-400">{sip.nextDate}</td>
                  <td className="p-4 text-sm font-semibold text-blue-600">{sip.yield}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteSip(sip.id)}
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

export default MutualFunds;