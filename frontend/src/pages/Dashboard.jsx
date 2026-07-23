import React from 'react';
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Welcome to your Dashboard</h2>
        <p className="welcome-sub">
          Track your balance, monthly spending, and check smart AI insights to manage your money.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Card 1 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Balance</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹24,500.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.4% from last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Spending</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹3,420.50</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>Under monthly budget limit</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">My Investments</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹8,124.00</h3>
            </div>
            <div className="card-icon-wrapper-indigo">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.3% projected earnings</span>
          </div>
        </div>
      </div>
      
      {/* Demo note */}
      <div className="demo-note-box">
        Note: The amounts shown above are example figures. Check the connection status bar or visit the AI page to verify live connections.
      </div>
    </div>
  );
};

export default Dashboard;