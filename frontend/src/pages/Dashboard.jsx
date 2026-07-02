import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-indigo-950/20 p-6 rounded-2xl border border-slate-900 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-100">Welcome to your Financial Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1">
          This boilerplate represents the project setup. The frontend, backend, and AI service are connected and running.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Balance</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">$24,500.00</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-400 mt-4">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.4% this month</span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Monthly Expenses</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">$3,420.50</h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-rose-400 mt-4">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>-8.2% from budget limit</span>
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Investment Growth</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">$8,124.00</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-indigo-400 mt-4">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.3% overall yield</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-xs text-slate-500">
        Note: The data shown above is static placeholder data representing layout styling. Live connections are verified using the status bar or the AI Insights page.
      </div>
    </div>
  );
};

export default Dashboard;