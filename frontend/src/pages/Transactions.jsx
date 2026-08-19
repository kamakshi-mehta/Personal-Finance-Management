import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, ShoppingCart, Plus, Trash2, Edit2, Check, X, Search, ChevronLeft, ChevronRight, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  // Add Form States
  const [showForm, setShowForm] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Spending');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Inline Editing States
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editType, setEditType] = useState('');
  const [editDate, setEditDate] = useState('');
  const [savingId, setSavingId] = useState(null);

  const categoriesList = ['Spending', 'Income', 'Investments', 'Groceries', 'Rent', 'Leisure', 'Utilities'];

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit,
        search,
        type: typeFilter,
        category: categoryFilter
      };

      const res = await axiosClient.get('/transactions', { params });
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalTransactions);

      // Sync local storage for compatibilities
      syncToLocalStorage(res.data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
      setError('Failed to fetch transactions from server');
    } finally {
      setLoading(false);
    }
  };

  // Run search/filter resets to page 1
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, categoryFilter]);

  // Fetch when page, search, or filters change
  useEffect(() => {
    fetchTransactions();
  }, [page, search, typeFilter, categoryFilter]);

  const syncToLocalStorage = (dbTxs) => {
    // Keep local cache synced for Dashboard and Budget page calculations
    const formattedLSTxs = dbTxs.map(tx => ({
      id: tx._id,
      desc: tx.description,
      amount: tx.type === 'income' ? Math.abs(tx.amount) : -Math.abs(tx.amount),
      category: tx.category,
      date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    }));
    localStorage.setItem('wealth_transactions', JSON.stringify(formattedLSTxs));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');
    if (!desc || !amount) return;

    setSubmitting(true);
    const amt = parseFloat(amount);
    const isIncome = category === 'Income';
    const type = isIncome ? 'income' : 'expense';

    try {
      await axiosClient.post('/transactions', {
        description: desc,
        amount: amt,
        type,
        category,
        date: date ? new Date(date) : new Date()
      });

      // Clear add states and reload
      setDesc('');
      setAmount('');
      setCategory('Spending');
      setDate('');
      setShowForm(false);
      
      // Reload current list
      fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err.message);
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (tx) => {
    setEditingId(tx._id);
    setEditDesc(tx.description);
    setEditAmount(tx.amount.toString());
    setEditCategory(tx.category);
    setEditType(tx.type);
    setEditDate(tx.date.substring(0, 10)); // formats YYYY-MM-DD
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdateTransaction = async (id) => {
    setError('');
    if (!editDesc || !editAmount) return;

    setSavingId(id);
    try {
      await axiosClient.put(`/transactions/${id}`, {
        description: editDesc,
        amount: parseFloat(editAmount),
        category: editCategory,
        type: editType,
        date: new Date(editDate)
      });

      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      console.error('Error updating transaction:', err.message);
      setError('Failed to update transaction');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteTransaction = async (id) => {
    setError('');
    try {
      await axiosClient.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err.message);
      setError('Failed to delete transaction from server');
    }
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

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Transaction Form */}
      {showForm && (
        <form onSubmit={handleAddTransaction} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">New Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Description / Merchant</label>
              <input
                type="text"
                placeholder="e.g. Groceries Mart"
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
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Transaction Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
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
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Logging...
                </>
              ) : (
                'Log Transaction'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Search and Filters panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search description or merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
          />
        </div>

        {/* Type Filter */}
        <div className="w-full md:w-44 flex flex-col space-y-1">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
          >
            <option value="all">All Types</option>
            <option value="income">Inflow (Income)</option>
            <option value="expense">Outflow (Spending)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-44 flex flex-col space-y-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
          >
            <option value="all">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
          <span className="text-slate-500 text-sm font-semibold">Loading transaction records...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="table-container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell">Description</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 text-sm">
                      No matching transaction logs found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const isEditing = editingId === tx._id;
                    const isIncome = tx.type === 'income';
                    const Icon = isIncome ? ShieldCheck : ShoppingCart;
                    const color = isIncome 
                      ? 'text-blue-700 bg-blue-50 border border-blue-100/50' 
                      : 'text-indigo-600 bg-indigo-50 border border-indigo-100/50';

                    if (isEditing) {
                      return (
                        <tr key={tx._id} className="bg-blue-50/20">
                          <td className="p-3">
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white w-full focus:outline-none focus:border-blue-500"
                              required
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white w-full focus:outline-none"
                            >
                              {categoriesList.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white w-full focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={editType}
                              onChange={(e) => setEditType(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white w-full focus:outline-none"
                            >
                              <option value="income">Inflow (Income)</option>
                              <option value="expense">Outflow (Expense)</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white w-full focus:outline-none"
                              required
                            />
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end space-x-1.5">
                              <button
                                onClick={() => handleUpdateTransaction(tx._id)}
                                disabled={savingId === tx._id}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer"
                              >
                                {savingId === tx._id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={tx._id} className="table-row">
                        <td className="p-4 flex items-center space-x-3">
                          <div className={`p-2 rounded-xl ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{tx.description}</span>
                        </td>
                        <td className="table-cell">{tx.category}</td>
                        <td className="p-4 text-sm text-slate-400">
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isIncome ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`p-4 text-sm font-semibold ${isIncome ? 'text-blue-700' : 'text-sky-600'}`}>
                          <span className="flex items-center">
                            {isIncome ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                            ₹{Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => startEdit(tx)}
                              className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(tx._id)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm text-sm">
              <span className="text-slate-500">
                Showing page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({totalCount} transactions)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;