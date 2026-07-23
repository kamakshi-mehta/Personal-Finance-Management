import React, { useState } from 'react';
import { Wallet, PiggyBank, Landmark, Percent, Plus, Edit, Trash2 } from 'lucide-react';

const BudgetPlanning = () => {
  // 1. Regular spending categories
  const [spendingBudgets, setSpendingBudgets] = useState([
    { id: 1, name: 'Groceries & Household', spent: 4800, limit: 10000, color: 'bg-blue-600' },
    { id: 2, name: 'Utilities & Subscriptions', spent: 2200, limit: 5000, color: 'bg-indigo-600' },
    { id: 3, name: 'Travel & Commute', spent: 1500, limit: 3000, color: 'bg-sky-500' },
    { id: 4, name: 'Entertainment & Outings', spent: 3100, limit: 4000, color: 'bg-blue-400' },
  ]);

  // 2. Investment SIP commitments
  const [sipAllocations, setSipAllocations] = useState([
    { id: 1, name: 'Bluechip Equity Growth Fund', amount: 5000, type: 'Mutual Fund SIP', color: 'bg-blue-600' },
    { id: 2, name: 'Index Nifty 50 Fund', amount: 3000, type: 'Mutual Fund SIP', color: 'bg-indigo-600' },
  ]);

  // 3. Debt EMI obligations
  const [emiObligations, setEmiObligations] = useState([
    { id: 1, name: 'HDFC Car Loan EMI', amount: 8500, type: 'Automobile Loan', color: 'bg-sky-500' },
    { id: 2, name: 'SBI Education Loan EMI', amount: 5000, type: 'Student Loan', color: 'bg-blue-400' },
  ]);

  // Form toggles
  const [showCatForm, setShowCatForm] = useState(false);
  const [showSipForm, setShowSipForm] = useState(false);
  const [showEmiForm, setShowEmiForm] = useState(false);

  // Form input states
  const [catName, setCatName] = useState('');
  const [catSpent, setCatSpent] = useState('');
  const [catLimit, setCatLimit] = useState('');

  const [sipName, setSipName] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [sipType, setSipType] = useState('Mutual Fund SIP');

  const [emiName, setEmiName] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [emiType, setEmiType] = useState('Personal Loan');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!catName || !catLimit) return;
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-sky-500', 'bg-blue-400'];
    const newCat = {
      id: Date.now(),
      name: catName,
      spent: catSpent ? parseFloat(catSpent) : 0,
      limit: parseFloat(catLimit),
      color: colors[spendingBudgets.length % colors.length],
    };
    setSpendingBudgets([...spendingBudgets, newCat]);
    setCatName('');
    setCatSpent('');
    setCatLimit('');
    setShowCatForm(false);
  };

  const handleAddSip = (e) => {
    e.preventDefault();
    if (!sipName || !sipAmount) return;
    const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-sky-500', 'bg-blue-400'];
    const newSip = {
      id: Date.now(),
      name: sipName,
      amount: parseFloat(sipAmount),
      type: sipType,
      color: colors[sipAllocations.length % colors.length],
    };
    setSipAllocations([...sipAllocations, newSip]);
    setSipName('');
    setSipAmount('');
    setShowSipForm(false);
  };

  const handleAddEmi = (e) => {
    e.preventDefault();
    if (!emiName || !emiAmount) return;
    const newEmi = {
      id: Date.now(),
      name: emiName,
      amount: parseFloat(emiAmount),
      type: emiType,
    };
    setEmiObligations([...emiObligations, newEmi]);
    setEmiName('');
    setEmiAmount('');
    setShowEmiForm(false);
  };

  const handleDeleteCategory = (id) => {
    setSpendingBudgets(spendingBudgets.filter(cat => cat.id !== id));
  };

  const handleDeleteSip = (id) => {
    setSipAllocations(sipAllocations.filter(sip => sip.id !== id));
  };

  const handleDeleteEmi = (id) => {
    setEmiObligations(emiObligations.filter(emi => emi.id !== id));
  };

  // Calculations
  const totalRegularLimit = spendingBudgets.reduce((acc, curr) => acc + curr.limit, 0);
  const totalRegularSpent = spendingBudgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalSip = sipAllocations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalEmi = emiObligations.reduce((acc, curr) => acc + curr.amount, 0);

  const grandTotalBudget = totalRegularLimit + totalSip + totalEmi;
  const grandTotalCommitted = totalRegularSpent + totalSip + totalEmi;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="text-blue-600 w-7 h-7" />
          Comprehensive Budget Planner
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor all monthly allocations, including category budgets, investment SIPs, and loan EMI obligations.
        </p>
      </div>

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

      {/* Grid of Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Spending Categories */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-blue-600" /> Category Budgets
            </h3>
            <button
              onClick={() => { setShowCatForm(!showCatForm); setShowSipForm(false); setShowEmiForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category Budget
            </button>
          </div>

          {showCatForm && (
            <form onSubmit={handleAddCategory} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Category Budget Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dining Out"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Spent (₹ - optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1500"
                    value={catSpent}
                    onChange={(e) => setCatSpent(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
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
            {spendingBudgets.map((cat) => {
              const percent = Math.min((cat.spent / cat.limit) * 100, 100);
              return (
                <div key={cat.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Spent: ₹{cat.spent.toLocaleString('en-IN')}</span>
                    <span>Limit: ₹{cat.limit.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${cat.color}`} style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="text-[10px] text-right font-bold text-blue-600">
                    {percent.toFixed(0)}% Utilized
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Investment SIP Commitments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-600" /> Active Investment SIPs (Committed)
            </h3>
            <button
              onClick={() => { setShowSipForm(!showSipForm); setShowCatForm(false); setShowEmiForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add SIP Commitment
            </button>
          </div>

          {showSipForm && (
            <form onSubmit={handleAddSip} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New SIP Commitment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">SIP Type</label>
                  <select
                    value={sipType}
                    onChange={(e) => setSipType(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                  >
                    <option value="Mutual Fund SIP">Mutual Fund SIP</option>
                    <option value="Stock SIP">Stock SIP</option>
                    <option value="Gold SIP">Gold SIP</option>
                  </select>
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
            {sipAllocations.map((sip) => (
              <div key={sip.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 text-sm">{sip.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{sip.type}</span>
                    <button
                      onClick={() => handleDeleteSip(sip.id)}
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
                  <div className={`h-2 rounded-full ${sip.color}`} style={{ width: '100%' }}></div>
                </div>
                <div className="text-[10px] text-right font-bold text-blue-600">
                  100% Invested
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Loan EMI Obligations */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-600" /> Loan EMI Obligations (Fixed Dues)
            </h3>
            <button
              onClick={() => { setShowEmiForm(!showEmiForm); setShowCatForm(false); setShowSipForm(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add EMI Obligation
            </button>
          </div>

          {showEmiForm && (
            <form onSubmit={handleAddEmi} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New EMI Obligation Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Loan / EMI Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ICICI Home Loan EMI"
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
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-slate-500 font-semibold">Loan Type</label>
                  <select
                    value={emiType}
                    onChange={(e) => setEmiType(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Automobile Loan">Automobile Loan</option>
                    <option value="Student Loan">Student Loan</option>
                  </select>
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
            {emiObligations.map((emi) => (
              <div key={emi.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 text-sm">{emi.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">{emi.type}</span>
                    <button
                      onClick={() => handleDeleteEmi(emi.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Monthly EMI Outflow:</span>
                  <span className="text-blue-950 font-bold">₹{emi.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-sky-500" style={{ width: '100%' }}></div>
                </div>
                <div className="text-[10px] text-right font-bold text-sky-600">
                  100% Paid Dues
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanning;