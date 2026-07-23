import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Lightbulb, TrendingUp, Landmark, Percent } from 'lucide-react';

const AiInsights = () => {
  const [goal, setGoal] = useState('Balanced'); // Growth, Balanced, Safety

  // Loaded data states
  const [sips, setSips] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [fds, setFds] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    setSips(JSON.parse(localStorage.getItem('wealth_sips')) || []);
    setStocks(JSON.parse(localStorage.getItem('wealth_stocks')) || []);
    setFds(JSON.parse(localStorage.getItem('wealth_fds')) || []);
    setLoans(JSON.parse(localStorage.getItem('wealth_loans')) || []);
  }, []);

  const totalSip = sips.reduce((acc, curr) => acc + curr.amount, 0);
  const totalStocks = stocks.reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalFds = fds.reduce((acc, curr) => acc + curr.principal, 0);
  const totalDebt = loans.reduce((acc, curr) => acc + curr.outstanding, 0);
  const totalInvested = totalSip + totalStocks + totalFds;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="ai-section-title">
          <Cpu className="text-blue-600 w-7 h-7" />
          Smart AI Insights & Advisory
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Automated analysis of your active assets, debt ratios, and personalized recommendations.
        </p>
      </div>

      {/* Select Goal Accordion */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Your Financial Focus Goal</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Growth', 'Balanced', 'Safety'].map((profile) => (
            <button
              key={profile}
              onClick={() => setGoal(profile)}
              className={`py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-300 ${
                goal === profile
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50'
              }`}
            >
              {profile} Strategy
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Advice Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dynamic Debt Advice */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-600" />
            Liability & Debt Analysis
          </h3>
          <div className="space-y-3">
            {totalDebt > 0 ? (
              <p className="text-sm text-slate-700 leading-relaxed">
                You have active loan balances totaling <strong>₹{totalDebt.toLocaleString('en-IN')}</strong>. Under the selected <strong>{goal} strategy</strong>, it is recommended to prioritize paying off your highest interest loans first to save interest payments.
              </p>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed">
                Congratulations! You have <strong>no active liabilities</strong>. Your debt ratio is <strong>0%</strong>. This frees up maximum cash flow to accelerate your monthly investments.
              </p>
            )}
            <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
              <li>Keep total monthly debt payments below <strong>35% of monthly income</strong>.</li>
              <li>Always check if loan rates are floating or fixed before making <strong>prepayments</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Dynamic Asset Allocation Advice */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Asset Allocation Recommendation
          </h3>
          <div className="space-y-3">
            {totalInvested > 0 ? (
              <p className="text-sm text-slate-700 leading-relaxed">
                Your portfolio holds <strong>₹{totalInvested.toLocaleString('en-IN')}</strong> in mutual funds, stocks, and FDs. Under your current <strong>{goal} focus</strong>, aim to maintain a robust asset allocation ratio corresponding to your risk profile.
              </p>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed">
                You have <strong>no active investments</strong> registered. To take advantage of compounding growth, consider starting a recurring <strong>SIP of ₹2,000 to ₹5,000</strong> in equity or debt mutual funds.
              </p>
            )}
            <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
              {goal === 'Growth' && (
                <>
                  <li>Target allocation: <strong>70% Equity Stocks, 20% Mutual Funds, 10% FDs</strong>.</li>
                  <li>Focus on high-yield compounding instruments for long horizons.</li>
                </>
              )}
              {goal === 'Balanced' && (
                <>
                  <li>Target allocation: <strong>50% Equity Mutual Funds, 30% FDs, 20% Stocks</strong>.</li>
                  <li>Balance steady returns with low market volatility exposure.</li>
                </>
              )}
              {goal === 'Safety' && (
                <>
                  <li>Target allocation: <strong>70% Fixed Deposits, 20% Debt Mutual Funds, 10% Equity</strong>.</li>
                  <li>Maximize principal capital protection with secure fixed payouts.</li>
                </>
              )}
            </ul>
          </div>
        </div>

      </div>

      {/* Guidelines Panel */}
      <div className="guideline-box">
        <h3 className="guideline-title">
          <Lightbulb className="w-4 h-4 text-blue-700" />
          Financial Model Guidelines
        </h3>
        <ul className="guideline-list">
          <li className="guideline-item">
            <strong>Algorithmic Projections</strong>: AI estimations are based on <strong>historical spending trends</strong> and current balance logs.
          </li>
          <li className="guideline-item">
            <strong>Behavioral Adaptability</strong>: If spending patterns fluctuate, the AI model takes <strong>several days to recalculate</strong> new baseline habits.
          </li>
          <li className="guideline-item">
            <strong>Security & Feed Audits</strong>: Always verify <strong>active secure API connections</strong> to ensure calculations match real-time balances.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AiInsights;