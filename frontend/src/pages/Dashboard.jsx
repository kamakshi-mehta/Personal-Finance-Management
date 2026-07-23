import React from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Wealth Dashboard & Investment Center</h2>
        <p className="welcome-sub">
          Monitor your assets, analyze expense allocations, and query automated AI suggestions across your connected accounts.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Card 1 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Net Liquid Worth</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$24,500.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+12.4% yield yield</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Discretionary Outflows</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$3,420.50</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>-8.2% under monthly threshold</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Yield Assets</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">$8,124.00</h3>
            </div>
            <div className="card-icon-wrapper-indigo">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>+18.3% projected dividend</span>
          </div>
        </div>
      </div>
      
      {/* Demo note */}
      <div className="demo-note-box">
        Note: Figures reflect current simulated portfolio allocations. Sync with the Asset Ledger to verify live database connections and run AI predictions.
      </div>
    </div>
  );
};

export default Dashboard;