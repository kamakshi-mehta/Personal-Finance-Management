import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Lightbulb, TrendingUp, Landmark, Percent, Loader2, AlertCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AiInsights = () => {
  const [strategy, setStrategy] = useState('Balanced'); // Growth, Balanced, Safety
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insights, setInsights] = useState(null);

  const fetchInsights = async (selectedStrategy) => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/ai-insights', {
        params: { strategy: selectedStrategy }
      });
      setInsights(res.data);
    } catch (err) {
      console.error('Error fetching AI insights:', err.message);
      setError('AI service is currently offline or failed to generate insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(strategy);
  }, [strategy]);

  // SVG parameters for circular health score
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const score = insights ? insights.healthScore : 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
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
              onClick={() => setStrategy(profile)}
              className={`py-3 px-4 rounded-xl border text-sm font-semibold cursor-pointer transition-all duration-300 ${
                strategy === profile
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100/50'
              }`}
            >
              {profile} Strategy
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
          <span className="text-slate-500 text-sm font-semibold">Consulting AI model engine...</span>
        </div>
      ) : (
        insights && (
          <>
            {/* Health Score Circular Dashboard Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Financial Health Meter
                </span>
                <h3 className="text-xl font-bold text-slate-800">Your Current Rating: {insights.healthRating}</h3>
                <p className="text-slate-500 text-xs max-w-md">
                  Calculated dynamically from your total monthly savings rate ({insights.savingsRate}%) and outstanding liabilities compared to active holdings.
                </p>
              </div>

              {/* Circular SVG Score Progress */}
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Background Track Circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Active Blue Score Circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-blue-600 transition-all duration-500"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-extrabold text-blue-950">{score}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Health Score</span>
                </div>
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
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {insights.debtAnalysis}
                  </p>
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
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {insights.assetAllocation}
                  </p>
                  <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                    {strategy === 'Growth' && (
                      <>
                        <li>Target allocation: <strong>70% Equity Stocks, 20% Mutual Funds, 10% FDs</strong>.</li>
                        <li>Focus on high-yield compounding instruments for long horizons.</li>
                      </>
                    )}
                    {strategy === 'Balanced' && (
                      <>
                        <li>Target allocation: <strong>50% Equity Mutual Funds, 30% FDs, 20% Stocks</strong>.</li>
                        <li>Balance steady returns with low market volatility exposure.</li>
                      </>
                    )}
                    {strategy === 'Safety' && (
                      <>
                        <li>Target allocation: <strong>70% Fixed Deposits, 20% Debt Mutual Funds, 10% Equity</strong>.</li>
                        <li>Maximize principal capital protection with secure fixed payouts.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Budget Recommendations */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600" />
                  Budget & Expense Control
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {insights.budgetRecommendation}
                  </p>
                  <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                    <li>Maintain a minimum savings margin buffer of at least <strong>20% to 30%</strong>.</li>
                    <li>Utilize category limit budgets in the planner to automate restrictions.</li>
                  </ul>
                </div>
              </div>

              {/* Investment Educational Recommendation */}
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Investment Advisory (Educational)
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {insights.investmentRecommendation}
                  </p>
                  <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                    <li>Investments recommended are for general financial education purposes only.</li>
                    <li>Diversify SIP dates across the calendar month to average out entry price.</li>
                  </ul>
                </div>
              </div>

            </div>
          </>
        )
      )}

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