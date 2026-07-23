import React, { useState } from 'react';
import { Wallet, Calendar, ArrowDownRight, Plus, Trash2 } from 'lucide-react';

const Loans = () => {
  const [activeLoans, setActiveLoans] = useState([
    { id: 1, name: 'HDFC Car Loan', totalAmount: 500000, outstanding: 320000, emi: 8500, rate: '8.75%', nextEmi: 'Aug 05, 2026' },
    { id: 2, name: 'SBI Education Loan', totalAmount: 300000, outstanding: 200000, emi: 5000, rate: '9.20%', nextEmi: 'Aug 10, 2026' },
  ]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [loanName, setLoanName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [outstanding, setOutstanding] = useState('');
  const [emi, setEmi] = useState('');
  const [rate, setRate] = useState('');

  const handleAddLoan = (e) => {
    e.preventDefault();
    if (!loanName || !principal || !outstanding || !emi || !rate) return;

    const newLoan = {
      id: Date.now(),
      name: loanName,
      totalAmount: parseFloat(principal),
      outstanding: parseFloat(outstanding),
      emi: parseFloat(emi),
      rate: rate.endsWith('%') ? rate : `${parseFloat(rate).toFixed(2)}%`,
      nextEmi: 'Aug 05, 2026',
    };

    setActiveLoans([...activeLoans, newLoan]);
    setLoanName('');
    setPrincipal('');
    setOutstanding('');
    setEmi('');
    setRate('');
    setShowForm(false);
  };

  const handleDeleteLoan = (id) => {
    setActiveLoans(activeLoans.filter(loan => loan.id !== id));
  };

  // Calculations
  const totalOutstanding = activeLoans.reduce((acc, curr) => acc + curr.outstanding, 0);
  const totalEmi = activeLoans.reduce((acc, curr) => acc + curr.emi, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="text-blue-600 w-7 h-7" />
            Loans & EMIs
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Monitor your active liabilities, outstanding dues, and monthly installments.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Register Loan'}
        </button>
      </div>

      {/* Add New Loan Form */}
      {showForm && (
        <form onSubmit={handleAddLoan} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Loan Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Loan Account / Bank</label>
              <input
                type="text"
                placeholder="e.g. Axis Bank Personal Loan"
                value={loanName}
                onChange={(e) => setLoanName(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Principal Sanctioned (₹)</label>
              <input
                type="number"
                placeholder="e.g. 200000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Outstanding Dues (₹)</label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={outstanding}
                onChange={(e) => setOutstanding(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Monthly EMI Outflow (₹)</label>
              <input
                type="number"
                placeholder="e.g. 4000"
                value={emi}
                onChange={(e) => setEmi(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Interest Rate (% p.a.)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 9.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
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
              Save Loan Account
            </button>
          </div>
        </form>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Outstanding Debt</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalOutstanding.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-sky-600 mt-4 font-medium flex items-center">
            <ArrowDownRight className="w-4 h-4 mr-0.5" />
            Total consolidated debt obligation
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Monthly EMI</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{totalEmi.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Accumulated monthly installment dues
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Liabilities</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Loan Account / Bank</th>
              <th className="table-header-cell">Principal Amount</th>
              <th className="table-header-cell">Outstanding Amount</th>
              <th className="table-header-cell">Monthly EMI</th>
              <th className="table-header-cell">Interest Rate</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeLoans.map((loan) => (
              <tr key={loan.id} className="table-row">
                <td className="p-4 font-medium text-slate-800 text-sm">{loan.name}</td>
                <td className="p-4 text-sm text-slate-500">₹{loan.totalAmount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-slate-700 font-semibold">₹{loan.outstanding.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-blue-600 font-semibold">₹{loan.emi.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-slate-400">{loan.rate}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteLoan(loan.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;