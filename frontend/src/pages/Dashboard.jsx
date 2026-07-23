import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-50/60 via-white to-indigo-50/40 p-6 rounded-2xl border border-blue-100/80 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to your Financial Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">
          This boilerplate represents the project setup. The frontend, backend, and AI service are connected and running.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Balance</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$24,500.00</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/50">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-600 mt-4 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Expenses</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$3,420.50</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/50">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-rose-600 mt-4 font-medium">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>-8.2% from budget limit</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Investment Growth</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$8,124.00</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-indigo-600 mt-4 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.3% overall yield</span>
          </div>
        </div>
      </div>
      
      {/* Demo note */}
      <div className="bg-white/40 border border-slate-200/60 rounded-xl p-4 text-xs text-slate-400 shadow-sm backdrop-blur-xs">
        Note: The data shown above is static placeholder data representing layout styling. Live connections are verified using the status bar or the AI Insights page.
      </div>
    </div>
  );
};

export default Dashboard;