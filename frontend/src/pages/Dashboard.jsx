import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Lightbulb, Edit2, Check, ShieldCheck, ShoppingCart, Calendar } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
  const [baselineBalance, setBaselineBalance] = useState(() => {
    return parseFloat(localStorage.getItem('wealth_baseline_balance')) || 0;
  });
  const [editingBalance, setEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState('');

  // Loaded state metrics from other sections
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  // Month-specific summary metrics
  const [monthlyInflow, setMonthlyInflow] = useState(0);
  const [monthlyOutflow, setMonthlyOutflow] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);

  // Transactions list
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      // 1. Fetch backend transactions (protected)
      let transactionsList = [];
      try {
        const res = await axiosClient.get('/transactions', { params: { limit: 50 } });
        transactionsList = res.data.transactions || [];
        setRecentTransactions(transactionsList.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard transactions:', err.message);
      }

      // 2. Fetch SIPs from LocalStorage
      const sips = JSON.parse(localStorage.getItem('wealth_sips')) || [];
      const totalSip = sips.reduce((acc, curr) => acc + curr.amount, 0);

      // 3. Fetch Stocks from LocalStorage
      const stocks = JSON.parse(localStorage.getItem('wealth_stocks')) || [];
      const totalStocks = stocks.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);

      // 4. Fetch FDs from LocalStorage
      const fds = JSON.parse(localStorage.getItem('wealth_fds')) || [];
      const totalFds = fds.reduce((acc, curr) => acc + curr.principal, 0);

      // 5. Fetch Loans from LocalStorage
      const loans = JSON.parse(localStorage.getItem('wealth_loans')) || [];
      const totalOutstandingDebt = loans.reduce((acc, curr) => acc + curr.outstanding, 0);
      const totalEmi = loans.reduce((acc, curr) => acc + curr.emi, 0);

      // Calculations
      const calculatedInvestments = totalSip + totalStocks + totalFds;
      setTotalInvestments(calculatedInvestments);
      setTotalDebt(totalOutstandingDebt);

      // Calculate Net worth
      const netTxBalance = transactionsList.reduce((acc, curr) => {
        return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
      }, 0);
      const calculatedNetWorth = baselineBalance + calculatedInvestments - totalOutstandingDebt + netTxBalance;
      setNetWorth(calculatedNetWorth);

      // Calculate monthly summaries
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthTxs = transactionsList.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const incomeThisMonth = currentMonthTxs
        .filter(tx => tx.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);

      const expensesThisMonth = currentMonthTxs
        .filter(tx => tx.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);

      setMonthlyInflow(incomeThisMonth);
      setMonthlyOutflow(expensesThisMonth + totalEmi);
      setMonthlySavings(incomeThisMonth - (expensesThisMonth + totalEmi));

      // Calculate last 6 months dataset for SVG Chart
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
          monthName: d.toLocaleString('en-US', { month: 'short' }),
          monthNum: d.getMonth(),
          year: d.getFullYear(),
          inflow: 0,
          outflow: 0
        });
      }

      months.forEach(m => {
        const monthTxs = transactionsList.filter(tx => {
          const d = new Date(tx.date);
          return d.getMonth() === m.monthNum && d.getFullYear() === m.year;
        });

        m.inflow = monthTxs
          .filter(tx => tx.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0);

        m.outflow = monthTxs
          .filter(tx => tx.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0);
      });

      // Default mock values if there is no data to draw, so chart is never blank/empty!
      const hasData = months.some(m => m.inflow > 0 || m.outflow > 0);
      if (!hasData) {
        months[0].inflow = 15000; months[0].outflow = 10000;
        months[1].inflow = 20000; months[1].outflow = 12000;
        months[2].inflow = 18000; months[2].outflow = 14000;
        months[3].inflow = 25000; months[3].outflow = 16000;
        months[4].inflow = 30000; months[4].outflow = 20000;
        months[5].inflow = 35000; months[5].outflow = 22000;
      }

      setChartData(months);
    };

    loadDashboardData();
  }, [baselineBalance]);

  const handleSaveBalance = (e) => {
    e.preventDefault();
    const val = parseFloat(tempBalance) || 0;
    setBaselineBalance(val);
    localStorage.setItem('wealth_baseline_balance', val);
    setEditingBalance(false);
  };

  // Find max value in chart to scale SVG coordinates
  const maxVal = Math.max(...chartData.map(d => Math.max(d.inflow, d.outflow)), 1000);

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

        {/* Card 2: Investments */}
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

        {/* Card 3: Debt Liabilities */}
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Outstanding Debt</p>
              <div className="flex items-center space-x-2 mt-2">
                <h3 className="text-3xl font-extrabold text-blue-950">
                  ₹{totalDebt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="metric-change-down">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            <span>Total active loan balance obligations</span>
          </div>
        </div>
      </div>

      {/* Monthly Summary & SVG Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Summary Cards (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-800">Financial Cashflow Overview</h3>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Last 6 Months Comparison
            </span>
          </div>

          {/* SVG Chart */}
          <div className="w-full flex items-center justify-center pt-2">
            <svg viewBox="0 0 500 220" className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {/* Loop month nodes to plot bars */}
              {chartData.map((d, index) => {
                const colWidth = 70;
                const startX = 50 + index * colWidth;

                // Scale values: max height = 150px
                const barHeightInflow = (d.inflow / maxVal) * 150;
                const barHeightOutflow = (d.outflow / maxVal) * 150;

                const yInflow = 170 - barHeightInflow;
                const yOutflow = 170 - barHeightOutflow;

                return (
                  <g key={d.monthName}>
                    {/* Inflow Bar (Blue) */}
                    <rect
                      x={startX}
                      y={yInflow}
                      width="16"
                      height={Math.max(barHeightInflow, 2)}
                      rx="3"
                      fill="#2563eb"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    {/* Outflow Bar (Light Indigo) */}
                    <rect
                      x={startX + 20}
                      y={yOutflow}
                      width="16"
                      height={Math.max(barHeightOutflow, 2)}
                      rx="3"
                      fill="#818cf8"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    {/* Month Label */}
                    <text
                      x={startX + 18}
                      y="190"
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-bold"
                    >
                      {d.monthName}
                    </text>
                  </g>
                );
              })}

              {/* Key legends */}
              <rect x="30" y="205" width="10" height="10" rx="2" fill="#2563eb" />
              <text x="45" y="213" className="text-[10px] fill-slate-500 font-bold">Monthly Inflow (Income)</text>

              <rect x="200" y="205" width="10" height="10" rx="2" fill="#818cf8" />
              <text x="215" y="213" className="text-[10px] fill-slate-500 font-bold">Monthly Outflow (Spending)</text>
            </svg>
          </div>
        </div>

        {/* Monthly Summary Breakdown (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
            This Month's Summary
          </h3>
          
          <div className="space-y-4 flex-1 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Income Inflow</span>
              <span className="text-sm font-bold text-blue-600">
                +₹{monthlyInflow.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Expenses & EMIs</span>
              <span className="text-sm font-bold text-indigo-500">
                -₹{monthlyOutflow.toLocaleString('en-IN')}
              </span>
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-700 font-bold">Net Savings</span>
              <span className={`text-sm font-extrabold ${monthlySavings >= 0 ? 'text-blue-700' : 'text-rose-500'}`}>
                {monthlySavings >= 0 ? '+' : ''}₹{monthlySavings.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl flex items-start space-x-2 text-[10px] text-slate-500 leading-relaxed border border-slate-100">
            <Calendar className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span>Summary reflects transaction records logged in the current calendar month plus active EMIs.</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions & Guidelines panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Feed (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
            Recent Ledger Entries
          </h3>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-6">
                No recent transaction records logged. Click "All Transactions" to log.
              </p>
            ) : (
              recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const Icon = isIncome ? ShieldCheck : ShoppingCart;
                const color = isIncome 
                  ? 'text-blue-700 bg-blue-50 border border-blue-100/50' 
                  : 'text-indigo-600 bg-indigo-50 border border-indigo-100/50';

                return (
                  <div key={tx._id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors border border-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">{tx.category}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${isIncome ? 'text-blue-700' : 'text-sky-600'}`}>
                      {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Guidelines panel (1 col) */}
        <div className="guideline-box flex flex-col justify-between">
          <div>
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
      </div>
    </div>
  );
};

export default Dashboard;