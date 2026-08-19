import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Lightbulb, TrendingUp, Landmark, Percent, Loader2, AlertCircle, TrendingDown, ArrowUpRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AiInsights = () => {
  const [strategy, setStrategy] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [insights, setInsights] = useState(null);

  // Local state for interactive slider rate
  const [sliderRate, setSliderRate] = useState(10);

  const fetchInsights = async (selectedStrategy) => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/ai-insights', {
        params: { strategy: selectedStrategy }
      });
      setInsights(res.data);
      // Synchronize the slider rate with the AI model recommended rate initially
      setSliderRate(res.data.expectedRate || 10);
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

  // Calculate 5-year investment growth array locally based on the slider rate!
  const getGrowthData = () => {
    if (!insights) return [];
    const p = insights.initialInvested || 0;
    const rate = sliderRate / 100;
    // Assume they invest 50% of their projected monthly savings annually
    const annualContribution = (insights.projectedSavings || 0) * 12 * 0.5;

    const data = [{ year: 'Current', value: p }];
    let currentBalance = p;

    for (let t = 1; t <= 5; t++) {
      currentBalance = currentBalance * (1 + rate) + annualContribution;
      data.push({
        year: `Year ${t}`,
        value: currentBalance
      });
    }
    return data;
  };

  const growthData = getGrowthData();

  // SVG parameters for circular health score
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const score = insights ? insights.healthScore : 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // SVG coordinates mapping for 5-Year Growth Chart
  // viewBox="0 0 500 200"
  // margins: left 50, right 30, top 20, bottom 30
  // width: 420, height: 150
  const chartWidth = 420;
  const chartHeight = 140;
  const paddingLeft = 60;
  const paddingTop = 20;

  const getChartPath = () => {
    if (growthData.length === 0) return '';
    const maxVal = Math.max(...growthData.map(d => d.value), 1000);
    const minVal = Math.min(...growthData.map(d => d.value), 0);
    const valueRange = maxVal - minVal || 1;

    const points = growthData.map((d, index) => {
      const x = paddingLeft + (index * (chartWidth / (growthData.length - 1)));
      const y = paddingTop + chartHeight - ((d.value - minVal) / valueRange) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="text-blue-600 w-7 h-7" />
          Smart AI Insights & Advisory
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Personalized forecasting models, next-month expense forecasts, and investment compounding simulators.
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
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-slate-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
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

            {/* Predictive Forecasting Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="metric-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Projected Next-Month Outflow</p>
                    <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{insights.projectedExpense.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="card-icon-wrapper-sky">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-medium">
                  Estimates standard utility charges, rent, and active loan EMIs
                </p>
              </div>

              <div className="metric-card">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Projected Next-Month Surplus Savings</p>
                    <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹{insights.projectedSavings.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="card-icon-wrapper-blue">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-0.5" />
                  Target margin capacity available for wealth building
                </p>
              </div>
            </div>

            {/* Predictive Growth SVG Line Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">5-Year Portfolio Growth Projection</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Assumes a compounding return yield on current assets + 50% monthly savings additions.</p>
                </div>
                {/* Expected Yield rate slider */}
                <div className="flex flex-col space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-full sm:w-60">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Expected Annual Yield:</span>
                    <span className="text-blue-600 font-bold">{sliderRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={sliderRate}
                    onChange={(e) => setSliderRate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Line graph plotting */}
              <div className="w-full flex items-center justify-center pt-2">
                <svg viewBox="0 0 500 200" className="w-full h-auto overflow-visible">
                  {/* Grid background lines */}
                  <line x1={paddingLeft} y1="20" x2="480" y2="20" stroke="#f8fafc" strokeWidth="1" />
                  <line x1={paddingLeft} y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1={paddingLeft} y1="160" x2="480" y2="160" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Draw Growth Path Line */}
                  <path
                    d={getChartPath()}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Plot Circle Nodes and value text labels */}
                  {growthData.map((d, index) => {
                    const maxVal = Math.max(...growthData.map(d => d.value), 1000);
                    const minVal = Math.min(...growthData.map(d => d.value), 0);
                    const valueRange = maxVal - minVal || 1;

                    const x = paddingLeft + (index * (chartWidth / (growthData.length - 1)));
                    const y = paddingTop + chartHeight - ((d.value - minVal) / valueRange) * chartHeight;

                    return (
                      <g key={d.year}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="3"
                        />
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-slate-800"
                        >
                          ₹{(d.value / 1000).toFixed(0)}k
                        </text>
                        <text
                          x={x}
                          y="185"
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-slate-400"
                        >
                          {d.year}
                        </text>
                      </g>
                    );
                  })}
                </svg>
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