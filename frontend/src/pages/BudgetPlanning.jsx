import React, { useState, useEffect } from 'react';
import { Wallet, PiggyBank, Landmark, Percent, Plus, Trash2, Edit2, Check, X, Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const BudgetPlanning = () => {
  // Database States
  const [spendingBudgets, setSpendingBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [sipAllocations, setSipAllocations] = useState([]);
  const [emiObligations, setEmiObligations] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form toggles
  const [showCatForm, setShowCatForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showSipForm, setShowSipForm] = useState(false);
  const [showEmiForm, setShowEmiForm] = useState(false);

  // Form input states
  const [catName, setCatName] = useState('');
  const [catLimit, setCatLimit] = useState('');

  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');

  const [sipName, setSipName] = useState('');
  const [sipAmount, setSipAmount] = useState('');

  const [emiName, setEmiName] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [emiType, setEmiType] = useState('Personal Loan');

  // Savings Goal editing progress states
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalCurrent, setEditGoalCurrent] = useState('');

  const loadPlanningData = async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetsRes, savingsRes, investmentsRes, loansRes, txsRes] = await Promise.all([
        axiosClient.get('/budgets'),
        axiosClient.get('/savings'),
        axiosClient.get('/investments?type=mutual_fund'),
        axiosClient.get('/loans'),
        axiosClient.get('/transactions', { params: { limit: 100 } })
      ]);

      setSpendingBudgets(budgetsRes.data);
      setSavingsGoals(savingsRes.data);
      setSipAllocations(investmentsRes.data);
      setEmiObligations(loansRes.data);
      setTransactions(txsRes.data.transactions || []);
    } catch (err) {
      console.error('Error loading planning page data:', err.message);
      setError('Failed to fetch data from the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlanningData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catName || !catLimit) return;
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-sky-500', 'bg-blue-400'];
    const color = colors[spendingBudgets.length % colors.length];

    try {
      await axiosClient.post('/budgets', {
        name: catName,
        limit: parseFloat(catLimit),
        category: catName,
        color
      });
      setCatName('');
      setCatLimit('');
      setShowCatForm(false);
      loadPlanningData();
    } catch (err) {
      setError('Failed to save category budget');
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;

    try {
      await axiosClient.post('/savings', {
        name: goalName,
        targetAmount: parseFloat(goalTarget),
        currentAmount: parseFloat(goalCurrent) || 0,
        targetDate: goalDate ? new Date(goalDate) : undefined
      });
      setGoalName('');
      setGoalTarget('');
      setGoalCurrent('');
      setGoalDate('');
      setShowGoalForm(false);
      loadPlanningData();
    } catch (err) {
      setError('Failed to save savings goal');
    }
  };

  const handleAddSip = async (e) => {
    e.preventDefault();
    if (!sipName || !sipAmount) return;

    try {
      await axiosClient.post('/investments', {
        name: sipName,
        type: 'mutual_fund',
        amount: parseFloat(sipAmount)
      });
      setSipName('');
      setSipAmount('');
      setShowSipForm(false);
      loadPlanningData();
    } catch (err) {
      setError('Failed to save SIP allocation');
    }
  };

  const handleAddEmi = async (e) => {
    e.preventDefault();
    if (!emiName || !emiAmount) return;

    try {
      await axiosClient.post('/loans', {
        name: emiName,
        totalAmount: parseFloat(emiAmount) * 24, // simulated total amount
        outstanding: parseFloat(emiAmount) * 18,
        emi: parseFloat(emiAmount),
        rate: '9.00%'
      });
      setEmiName('');
      setEmiAmount('');
      setShowEmiForm(false);
      loadPlanningData();
    } catch (err) {
      setError('Failed to save EMI obligation');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axiosClient.delete(`/budgets/${id}`);
      loadPlanningData();
    } catch (err) {
      setError('Failed to delete budget');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axiosClient.delete(`/savings/${id}`);
      loadPlanningData();
    } catch (err) {
      setError('Failed to delete savings goal');
    }
  };

  const startEditGoal = (goal) => {
    setEditingGoalId(goal._id);
    setEditGoalCurrent(goal.currentAmount.toString());
  };

  const handleSaveGoalProgress = async (id) => {
    try {
      await axiosClient.put(`/savings/${id}`, {
        currentAmount: parseFloat(editGoalCurrent) || 0
      });
      setEditingGoalId(null);
      loadPlanningData();
    } catch (err) {
      setError('Failed to update savings progress');
    }
  };

  const handleDeleteSip = async (id) => {
    try {
      await axiosClient.delete(`/investments/${id}`);
      loadPlanningData();
    } catch (err) {
      setError('Failed to delete SIP');
    }
  };

  const handleDeleteEmi = async (id) => {
    try {
      await axiosClient.delete(`/loans/${id}`);
      loadPlanningData();
    } catch (err) {
      setError('Failed to delete EMI');
    }
  };

  const getCategorySpent = (categoryName) => {
    const term = categoryName.toLowerCase();
    return transactions
      .filter(tx => tx.type === 'expense')
      .filter(tx => {
        const descLower = tx.description.toLowerCase();
        const catLower = (tx.category || '').toLowerCase();
        return descLower.includes(term) || catLower.includes(term);
      })
      .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  };

  // Calculations
  const totalRegularLimit = spendingBudgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalRegularSpent = spendingBudgets.reduce((acc, curr) => acc + getCategorySpent(curr.name), 0);
  const totalSip = sipAllocations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalEmi = emiObligations.reduce((acc, curr) => acc + curr.emi, 0);

  const grandTotalBudget = totalRegularLimit + totalSip + totalEmi;
  const grandTotalCommitted = totalRegularSpent + totalSip + totalEmi;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
        <span className="text-slate-500 text-sm font-semibold">Loading budget planning metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="text-blue-600 w-7 h-7" />
          Comprehensive Budget Planner
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor all monthly allocations, including category budgets, savings goals, investment SIPs, and loan EMI obligations.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Allocated Outflow</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{grandTotalBudget.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Daily Spent: ₹{totalRegularSpent.toLocaleString('en-IN')} | SIPs: ₹{totalSip.toLocaleString('en-IN')} | EMIs: ₹{totalEmi.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Spent & Committed</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{grandTotalCommitted.toLocaleString('en-IN')}.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium">
            Remaining unspent spending allowance: ₹{Math.max(0, totalRegularLimit - totalRegularSpent).toLocaleString('en-IN')}.00
          </p>
        </div>
      </div>

      {/* Guidelines Panel */}
      <div className="guideline-box">
        <h3 className="guideline-title">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          Budgeting & Saving Guidelines
        </h3>
        <ul className="guideline-list">
          <li className="guideline-item">
            <strong>50/30/20 Rule</strong>: Allocate <strong>50% to needs</strong>, <strong>30% to wants</strong>, and <strong>20% directly to savings or debt payment</strong>.
          </li>
          <li className="guideline-item">
            <strong>Zero-Based Budgeting</strong>: Give every single Rupee a <strong>specific purpose or destination</strong> at the start of the month.
          </li>
          <li className="guideline-item">
            <strong>Fixed vs. Variable Costs</strong>: Identify <strong>fixed commitments (EMIs, SIPs)</strong> first, then adjust variable spending.
          </li>
        </ul>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Category Budgets */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-blue-600" /> Category Budgets
            </h3>
            <button
              onClick={() => { setShowCatForm(!showCatForm); setShowGoalForm(false); setShowSipForm(false); setShowEmiForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category Budget
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleAddCategory} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Category Budget Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Groceries"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Budget Limit (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={catLimit}
                    onChange={(e) => setCatLimit(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer">
                  Save Category Budget
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spendingBudgets.length === 0 ? (
              <div className="col-span-2 bg-white/40 p-6 rounded-2xl border border-slate-200/50 text-center text-slate-400 text-sm">
                No category budgets defined. Click "Add Category Budget" to initialize spending tracking.
              </div>
            ) : (
              spendingBudgets.map((cat) => {
                const spent = getCategorySpent(cat.name);
                const percent = Math.min((spent / cat.limit) * 100, 100);
                return (
                  <div key={cat._id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Spent: ₹{spent.toLocaleString('en-IN')}</span>
                      <span>Limit: ₹{cat.limit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${cat.color || 'bg-blue-600'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="text-[10px] text-right font-bold text-blue-600">
                      {percent.toFixed(0)}% Utilized
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Savings Goals */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <PiggyBank className="w-4 h-4 text-blue-600" /> Savings Goals & Milestones
            </h3>
            <button
              onClick={() => { setShowGoalForm(!showGoalForm); setShowCatForm(false); setShowSipForm(false); setShowEmiForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Savings Goal
            </button>
          </div>

          {showGoalForm && (
            <form onSubmit={handleAddGoal} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Savings Goal Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Goal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Emergency Fund"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Currently Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 40000"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Target Date</label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer">
                  Save Goal
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsGoals.length === 0 ? (
              <div className="col-span-2 bg-white/40 p-6 rounded-2xl border border-slate-200/50 text-center text-slate-400 text-sm">
                No active savings goals defined. Click "Add Savings Goal" to track your target milestones.
              </div>
            ) : (
              savingsGoals.map((goal) => {
                const percent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const isEditing = editingGoalId === goal._id;

                return (
                  <div key={goal._id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 text-sm">{goal.name}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => startEditGoal(goal)}
                          className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal._id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <input
                          type="number"
                          value={editGoalCurrent}
                          onChange={(e) => setEditGoalCurrent(e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 text-xs w-28 bg-white focus:outline-none"
                          required
                        />
                        <button
                          onClick={() => handleSaveGoalProgress(goal._id)}
                          className="p-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingGoalId(null)}
                          className="p-1 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Saved: ₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                        <span>Target: ₹{goal.targetAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="text-[10px] text-right font-bold text-blue-600">
                      {percent.toFixed(0)}% Saved
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 3: Investment SIP Commitments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-600" /> Active Investment SIPs (Committed)
            </h3>
            <button
              onClick={() => { setShowSipForm(!showSipForm); setShowCatForm(false); setShowGoalForm(false); setShowEmiForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add SIP Commitment
            </button>
          </div>

          {showSipForm && (
            <form onSubmit={handleAddSip} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New SIP Commitment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">SIP Fund Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Smallcap Growth Fund"
                    value={sipName}
                    onChange={(e) => setSipName(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Monthly Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 3000"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer">
                  Save SIP Allocation
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sipAllocations.length === 0 ? (
              <div className="col-span-2 bg-white/40 p-6 rounded-2xl border border-slate-200/50 text-center text-slate-400 text-sm">
                No active investment SIPs listed. Click "Add SIP Commitment" to register your plans.
              </div>
            ) : (
              sipAllocations.map((sip) => (
                <div key={sip._id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-sm">{sip.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">MUTUAL FUND</span>
                      <button
                        onClick={() => handleDeleteSip(sip._id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Monthly Allocation:</span>
                    <span className="text-blue-950 font-bold">₹{sip.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-[10px] text-right font-bold text-blue-600">
                    100% Invested
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 4: Loan EMI Obligations */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-600" /> Loan EMI Obligations (Fixed Dues)
            </h3>
            <button
              onClick={() => { setShowEmiForm(!showEmiForm); setShowCatForm(false); setShowGoalForm(false); setShowSipForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add EMI Obligation
            </button>
          </div>

          {showEmiForm && (
            <form onSubmit={handleAddEmi} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New EMI Obligation Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Loan / EMI Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Home Loan EMI"
                    value={emiName}
                    onChange={(e) => setEmiName(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Monthly EMI Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 12000"
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer">
                  Save EMI Obligation
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emiObligations.length === 0 ? (
              <div className="col-span-2 bg-white/40 p-6 rounded-2xl border border-slate-200/50 text-center text-slate-400 text-sm">
                No active loan EMI obligations registered. Click "Add EMI Obligation" to track fixed debt dues.
              </div>
            ) : (
              emiObligations.map((emi) => (
                <div key={emi._id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-sm">{emi.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">LIABILITY</span>
                      <button
                        onClick={() => handleDeleteEmi(emi._id)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Monthly EMI Outflow:</span>
                    <span className="text-blue-950 font-bold">₹{emi.emi.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-sky-500" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-[10px] text-right font-bold text-sky-600">
                    100% Paid Dues
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;