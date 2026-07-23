import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Lightbulb, Edit2, Check } from 'lucide-react';

const Dashboard = () => {
  const [baselineBalance, setBaselineBalance] = useState(() => {
    return parseFloat(localStorage.getItem('wealth_baseline_balance')) || 0;
  });
  const [editingBalance, setEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState('');

  // Loaded state metrics from other sections
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  useEffect(() => {
    // 1. Fetch SIPs
    const sips = JSON.parse(localStorage.getItem('wealth_sips')) || [];
    const totalSip = sips.reduce((acc, curr) => acc + curr.amount, 0);

    // 2. Fetch Stocks
    const stocks = JSON.parse(localStorage.getItem('wealth_stocks')) || [];
    const totalStocks = stocks.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);

    // 3. Fetch FDs
    const fds = JSON.parse(localStorage.getItem('wealth_fds')) || [];
    const totalFds = fds.reduce((acc, curr) => acc + curr.principal, 0);

    // 4. Fetch Loans
    const loans = JSON.parse(localStorage.getItem('wealth_loans')) || [];
    const totalOutstandingDebt = loans.reduce((acc, curr) => acc + curr.outstanding, 0);
    const totalEmi = loans.reduce((acc, curr) => acc + curr.emi, 0);

    // 5. Fetch Transactions
    const txs = JSON.parse(localStorage.getItem('wealth_transactions')) || [];
    const totalSpentTxs = txs
      .filter(tx => tx.amount < 0)
      .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
    const totalNetTxs = txs.reduce((acc, curr) => acc + curr.amount, 0);

    // Calculations
    const calculatedInvestments = totalSip + totalStocks + totalFds;
    const calculatedSpending = totalSpentTxs + totalEmi;
    const calculatedNetWorth = baselineBalance + calculatedInvestments - totalOutstandingDebt + totalNetTxs;

    setTotalInvestments(calculatedInvestments);
    setTotalSpending(calculatedSpending);
    setNetWorth(calculatedNetWorth);
  }, [baselineBalance]);

  const handleSaveBalance = (e) => {
    e.preventDefault();
    const val = parseFloat(tempBalance) || 0;
    setBaselineBalance(val);
    localStorage.setItem('wealth_baseline_balance', val);
    setEditingBalance(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 className="welcome-title">Welcome to your Dashboard</h2>
        <p className="welcome-sub">
          A centralized overview of your financial profile. This page pulls data from your Mutual Funds, Stocks, FDs, Loans, and Transactions.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        
        {/* Card 1: Total Balance / Net Worth */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Net Worth / Balance</p>
              
              {editingBalance ? (
                <form onSubmit={handleSaveBalance} className="flex items-center space-x-2 mt-2">
                  <input
                    type="number"
                    value={tempBalance}
                    onChange={(e) => setTempBalance(e.target.value)}
                    placeholder="Baseline Cash"
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
                    ₹{netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <button
                    onClick={() => { setTempBalance(baselineBalance); setEditingBalance(true); }}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Set baseline cash balance"
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
            <span>Includes Cash, Stocks, FDs, SIPs minus Debt</span>
          </div>
        </div>

        {/* Card 2: Monthly Spending */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Monthly Outflows</p>
              <div className="flex items-center space-x-2 mt-2">
                <h3 className="text-3xl font-extrabold text-blue-950">
                  ₹{totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>Sum of logged expenses & active EMIs</span>
          </div>
        </div>

        {/* Card 3: My Investments */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">My Investments</p>
              <div className="flex items-center space-x-2 mt-2">
                <h3 className="text-3xl font-extrabold text-blue-950">
                  ₹{totalInvestments.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="card-icon-wrapper-indigo">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-up">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>Combined value of FDs, SIPs & Stocks</span>
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