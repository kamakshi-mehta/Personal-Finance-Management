import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Welcome to your Financial Dashboard</h2>
        <p className="welcome-sub">
          This boilerplate represents the project setup. The frontend, backend, and AI service are connected and running.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Card 1 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Balance</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$24,500.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Expenses</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$3,420.50</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>-8.2% from budget limit</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Investment Growth</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$8,124.00</h3>
            </div>
            <div className="card-icon-wrapper-indigo">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.3% overall yield</span>
          </div>
        </div>
      </div>
      
      {/* Demo note */}
      <div className="demo-note-box">
        Note: The data shown above is static placeholder data representing layout styling. Live connections are verified using the status bar or the AI Insights page.
      </div>
    </div>
  );
};

export default Dashboard;