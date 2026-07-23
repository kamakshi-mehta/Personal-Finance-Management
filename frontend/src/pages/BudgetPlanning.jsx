import React from 'react';
import { Wallet, PiggyBank, Landmark, Percent, Calendar, Plus, Edit } from 'lucide-react';

const BudgetPlanning = () => {
  // 1. Regular spending categories
  const spendingBudgets = [
    { id: 1, name: 'Groceries & Household', spent: 4800, limit: 10000, color: 'bg-blue-600' },
    { id: 2, name: 'Utilities & Subscriptions', spent: 2200, limit: 5000, color: 'bg-indigo-600' },
    { id: 3, name: 'Travel & Commute', spent: 1500, limit: 3000, color: 'bg-sky-500' },
    { id: 4, name: 'Entertainment & Outings', spent: 3100, limit: 4000, color: 'bg-blue-400' },
  ];

  // 2. Investment SIP commitments
  const sipAllocations = [
    { id: 1, name: 'Bluechip Equity Growth Fund', amount: 5000, type: 'Mutual Fund SIP', color: 'bg-blue-600' },
    { id: 2, name: 'Index Nifty 50 Fund', amount: 3000, type: 'Mutual Fund SIP', color: 'bg-indigo-600' },
  ];

  // 3. Debt EMI obligations
  const emiObligations = [
    { id: 1, name: 'HDFC Car Loan EMI', amount: 8500, type: 'Automobile Loan', color: 'bg-sky-500' },
    { id: 2, name: 'SBI Education Loan EMI', amount: 5000, type: 'Student Loan', color: 'bg-blue-400' },
  ];

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
            Remaining unspent spending allowance: ₹{(totalRegularLimit - totalRegularSpent).toLocaleString('en-IN')}.00
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Adjust Limits
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spendingBudgets.map((cat) => {
              const percent = Math.min((cat.spent / cat.limit) * 100, 100);
              return (
                <div key={cat.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                    <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <Edit className="w-4 h-4" />
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
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-blue-600" /> Active Investment SIPs (Committed)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sipAllocations.map((sip) => (
              <div key={sip.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 text-sm">{sip.name}</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{sip.type}</span>
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
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-blue-600" /> Loan EMI Obligations (Fixed Dues)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emiObligations.map((emi) => (
              <div key={emi.id} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800 text-sm">{emi.name}</span>
                  <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">{emi.type}</span>
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