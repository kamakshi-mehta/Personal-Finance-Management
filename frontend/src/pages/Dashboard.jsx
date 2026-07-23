import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Lightbulb, Edit2, Check } from 'lucide-react';

const Dashboard = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [myInvestments, setMyInvestments] = useState(0);

  // Editing states
  const [editingBalance, setEditingBalance] = useState(false);
  const [editingSpending, setEditingSpending] = useState(false);
  const [editingInvestments, setEditingInvestments] = useState(false);

  // Temporary form values
  const [tempBalance, setTempBalance] = useState('');
  const [tempSpending, setTempSpending] = useState('');
  const [tempInvestments, setTempInvestments] = useState('');

  const handleSaveBalance = (e) => {
    e.preventDefault();
    setTotalBalance(parseFloat(tempBalance) || 0);
    setEditingBalance(false);
  };

  const handleSaveSpending = (e) => {
    e.preventDefault();
    setMonthlySpending(parseFloat(tempSpending) || 0);
    setEditingSpending(false);
  };

  const handleSaveInvestments = (e) => {
    e.preventDefault();
    setMyInvestments(parseFloat(tempInvestments) || 0);
    setEditingInvestments(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Welcome to your Dashboard</h2>
        <p className="welcome-sub">
          Track your balance, monthly spending, and check smart AI insights to manage your money. Click the edit icon to customize values.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        
        {/* Card 1: Total Balance */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Balance</p>
              
              {editingBalance ? (
                <form onSubmit={handleSaveBalance} className="flex items-center space-x-2 mt-2">
                  <input
                    type="number"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    placeholder="e.g. 50000"
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-slate-50 w-28 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button type="submit" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2 mt-2">
                  <h3 className="text-3xl font-extrabold text-blue-950">
                    ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <button
                    onClick={() => { setTempBalance(totalBalance); setEditingBalance(true); }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="card-icon-wrapper-blue">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Set your active holdings balance</span>
          </div>
        </div>

        {/* Card 2: Monthly Spending */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Spending</p>
              
              {editingSpending ? (
                <form onSubmit={handleSaveSpending} className="flex items-center space-x-2 mt-2">
                  <input
                    type="number"
                    value={tempSpending}
                    onChange={(e) => setTempSpending(e.target.value)}
                    placeholder="e.g. 15000"
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-slate-50 w-28 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button type="submit" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2 mt-2">
                  <h3 className="text-3xl font-extrabold text-blue-950">
                    ₹{monthlySpending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <button
                    onClick={() => { setTempSpending(monthlySpending); setEditingSpending(true); }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>Set your monthly expense target</span>
          </div>
        </div>

        {/* Card 3: My Investments */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">My Investments</p>
              
              {editingInvestments ? (
                <form onSubmit={handleSaveInvestments} className="flex items-center space-x-2 mt-2">
                  <input
                    type="number"
                    value={tempInvestments}
                    onChange={(e) => setTempInvestments(e.target.value)}
                    placeholder="e.g. 20000"
                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-slate-50 w-28 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button type="submit" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2 mt-2">
                  <h3 className="text-3xl font-extrabold text-blue-950">
                    ₹{myInvestments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <button
                    onClick={() => { setTempInvestments(myInvestments); setEditingInvestments(true); }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div className="card-icon-wrapper-indigo">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Set your active investment goals</span>
          </div>
        </div>
      </div>
      
      {/* Guidelines Panel */}
      <div className="guideline-box">
        <h3 className="guideline-title">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          General Wealth Rules
        </h3>
        <ul className="guideline-list">
          <li className="guideline-item">
            <strong>Emergency Fund</strong>: Maintain at least <strong>6 months of expenses</strong> in liquid accounts before committing capital.
          </li>
          <li className="guideline-item">
            <strong>Diversification</strong>: Spread assets across <strong>equities, mutual funds, and fixed deposits</strong> to lower exposure.
          </li>
          <li className="guideline-item">
            <strong>Asset Allocation</strong>: Align investments to your <strong>age, risk profile, and long-term financial milestones</strong>.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;