import React, { useState, useEffect } from 'react';
import { Landmark, Percent, Plus, Trash2, ArrowUpRight, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const FixedDeposits = () => {
  const [activeFds, setActiveFds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [maturityDate, setMaturityDate] = useState('');
  const [interestPayout, setInterestPayout] = useState('On Maturity');
  const [submitting, setSubmitting] = useState(false);

  const fetchFds = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/investments', { params: { type: 'fixed_deposit' } });
      setActiveFds(res.data);
    } catch (err) {
      console.error('Error fetching FDs:', err.message);
      setError('Failed to fetch Fixed Deposit records from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFds();
  }, []);

  const handleAddFd = async (e) => {
    e.preventDefault();
    setError('');
    if (!bankName || !principal || !interestRate) return;

    setSubmitting(true);
    try {
      await axiosClient.post('/investments', {
        name: bankName + (interestPayout ? ` - Payout: ${interestPayout}` : ''),
        type: 'fixed_deposit',
        amount: parseFloat(principal),
        interestRate: parseFloat(interestRate),
        maturityDate: maturityDate ? new Date(maturityDate) : undefined
      });

      setBankName('');
      setPrincipal('');
      setInterestRate('');
      setMaturityDate('');
      setInterestPayout('On Maturity');
      setShowForm(false);
      fetchFds();
    } catch (err) {
      console.error('Error saving FD:', err.message);
      setError('Failed to save FD certificate record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFd = async (id) => {
    setError('');
    try {
      await axiosClient.delete(`/investments/${id}`);
      fetchFds();
    } catch (err) {
      console.error('Error deleting FD:', err.message);
      setError('Failed to delete FD record');
    }
  };

  // Calculations
  const totalPrincipal = activeFds.reduce((acc, curr) => acc + curr.amount, 0);
  const avgRate = activeFds.reduce((acc, curr) => acc + (curr.interestRate || 0), 0) / (activeFds.length || 1);
  const projectedInterest = activeFds.reduce((acc, curr) => acc + (curr.amount * (curr.interestRate || 0) / 100), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="text-blue-600 w-7 h-7" />
            Fixed Deposits (FD)
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor your safe, fixed-interest bank deposits and maturity dates.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Create FD'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add New FD Form */}
      {showForm && (
        <form onSubmit={handleAddFd} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Fixed Deposit Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Bank / FD Name</label>
              <input
                type="text"
                placeholder="e.g. HDFC Bank FD"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Principal Deposit (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 7.25"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Maturity Date</label>
              <input
                type="date"
                value={maturityDate}
                onChange={(e) => setMaturityDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Interest Payout</label>
              <select
                value={interestPayout}
                onChange={(e) => setInterestPayout(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              >
                <option value="On Maturity">On Maturity</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
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
                'Save Fixed Deposit'
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
          <span className="text-slate-500 text-sm font-semibold">Loading FD portfolios...</span>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="metric-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total FD Investments</p>
                  <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalPrincipal.toLocaleString('en-IN')}.00</h3>
                </div>
                <div className="card-icon-wrapper-blue">
                  <Landmark className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                Average Yield Rate: {avgRate ? avgRate.toFixed(2) : '0.00'}%
              </p>
            </div>

            <div className="metric-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Est. Annual Interest Yield</p>
                  <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{projectedInterest.toLocaleString('en-IN')}.00</h3>
                </div>
                <div className="card-icon-wrapper-sky">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 font-medium">
                Accrued interest across all active accounts
              </p>
            </div>
          </div>

          {/* Guidelines Panel */}
          <div className="guideline-box">
            <h3 className="guideline-title">
              <Lightbulb className="w-4 h-4 text-blue-700" />
              FD Investing Guidelines
            </h3>
            <ul className="guideline-list">
              <li className="guideline-item">
                <strong>Guaranteed Returns</strong>: FDs provide <strong>assured, risk-free interest rates</strong> locked in for the entire tenure.
              </li>
              <li className="guideline-item">
                <strong>Premature Withdrawal</strong>: Withdrawing before maturity usually incurs a <strong>penalty rate reduction</strong>.
              </li>
            </ul>
          </div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Active Fixed Deposits</h3>

          <div className="table-container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell">Bank / FD Name</th>
                  <th className="table-header-cell">Principal Amount</th>
                  <th className="table-header-cell">Interest Rate</th>
                  <th className="table-header-cell">Maturity Date</th>
                  <th className="table-header-cell">Interest Payout</th>
                  <th className="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeFds.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                      No active fixed deposits registered. Click "Create FD" to register your deposit.
                    </td>
                  </tr>
                ) : (
                  activeFds.map((fd) => {
                    const nameParts = fd.name.split(' - Payout: ');
                    const bankNameDisplay = nameParts[0];
                    const payoutDisplay = nameParts[1] || 'On Maturity';

                    return (
                      <tr key={fd._id} className="table-row">
                        <td className="p-4 font-medium text-slate-800 text-sm">{bankNameDisplay}</td>
                        <td className="p-4 text-sm text-slate-700 font-semibold">₹{fd.amount.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-sm text-blue-600 font-semibold">{fd.interestRate}%</td>
                        <td className="p-4 text-sm text-slate-400">
                          {fd.maturityDate ? new Date(fd.maturityDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'TBD'}
                        </td>
                        <td className="p-4 text-sm text-slate-500">{payoutDisplay}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteFd(fd._id)}
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

export default FixedDeposits;