import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, ShoppingCart, Plus, Trash2 } from 'lucide-react';

const Transactions = () => {
  const [mockTransactions, setMockTransactions] = useState([
    { id: 1, desc: 'Salary Bonus', amount: 45.50, category: 'Income', date: 'July 01, 2026', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border border-blue-100/50' },
    { id: 2, desc: 'Monthly Salary', amount: 3500.00, category: 'Income', date: 'June 30, 2026', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border border-blue-100/50' },
    { id: 3, desc: 'Stock Investment (ETF)', amount: -124.99, category: 'Investments', date: 'June 28, 2026', icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-50 border border-indigo-100/50' },
  ]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Spending');
  const [date, setDate] = useState('');

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;

    const amt = parseFloat(amount);
    const isIncome = category === 'Income';
    const finalAmount = isIncome ? Math.abs(amt) : -Math.abs(amt);

    const newTx = {
      id: Date.now(),
      desc: desc,
      amount: finalAmount,
      category: category,
      date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      icon: isIncome ? ShieldCheck : ShoppingCart,
      color: isIncome 
        ? 'text-blue-700 bg-blue-50 border border-blue-100/50' 
        : 'text-indigo-600 bg-indigo-50 border border-indigo-100/50',
    };

    setMockTransactions([newTx, ...mockTransactions]);
    setDesc('');
    setAmount('');
    setCategory('Spending');
    setDate('');
    setShowForm(false);
  };

  const handleDeleteTransaction = (id) => {
    setMockTransactions(mockTransactions.filter(tx => tx.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recent Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">A history of your income and spending.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" /> {showForm ? 'Close Form' : 'Log Transaction'}
        </button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <form onSubmit={handleAddTransaction} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Description</label>
              <input
                type="text"
                placeholder="e.g. Reliance Stock Dividend"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Category Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              >
                <option value="Spending">Spending / Outflow</option>
                <option value="Income">Income / Inflow</option>
                <option value="Investments">Investments</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Transaction Date</label>
              <input
                type="text"
                placeholder="e.g. July 03, 2026"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              Log Transaction
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Category</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell">Amount</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockTransactions.map((tx) => {
              const Icon = tx.icon;
              return (
                <tr key={tx.id} className="table-row">
                  <td className="p-4 flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${tx.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{tx.desc}</span>
                  </td>
                  <td className="table-cell">{tx.category}</td>
                  <td className="p-4 text-sm text-slate-400">{tx.date}</td>
                  <td className={`p-4 text-sm font-semibold ${tx.amount > 0 ? 'text-blue-700' : 'text-sky-600'}`}>
                    <span className="flex items-center">
                      {tx.amount > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      ₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;