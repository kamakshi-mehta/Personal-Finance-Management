import React from 'react';
import { Wallet, PiggyBank, Plus, Edit } from 'lucide-react';

const BudgetPlanning = () => {
  const categories = [
    { id: 1, name: 'Groceries & Household', spent: 4800, limit: 10000, color: 'bg-blue-600' },
    { id: 2, name: 'Utilities & Subscriptions', spent: 2200, limit: 5000, color: 'bg-indigo-600' },
    { id: 3, name: 'Travel & Commute', spent: 1500, limit: 3000, color: 'bg-sky-500' },
    { id: 4, name: 'Entertainment & Outings', spent: 3100, limit: 4000, color: 'bg-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet className="text-blue-600 w-7 h-7" />
            Budget Planning
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Define spending thresholds for specific sectors to monitor your expenses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Combined Budget</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹22,000.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Active category allowances allocated
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Spending</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹11,600.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium">
            Remaining unspent allowance: ₹10,400.00
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Category Budgets</h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/80 text-blue-600 font-semibold text-xs rounded-xl border border-blue-100 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
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
                <span>Spent: ₹{cat.spent}</span>
                <span>Limit: ₹{cat.limit}</span>
              </div>
              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${cat.color}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-right font-bold text-blue-600">
                {percent.toFixed(0)}% Utilized
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPlanning;