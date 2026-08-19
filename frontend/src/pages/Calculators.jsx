import React, { useState, useEffect } from 'react';
import { Calculator, Landmark, Percent, Wallet, ArrowUpRight, TrendingUp, AlertCircle, Loader2, Check, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Calculators = () => {
  const [activeTab, setActiveTab] = useState('sip');

  // Database Data for Net Worth Calculator
  const [dbData, setDbData] = useState({
    investments: [],
    loans: [],
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchDbData = async () => {
      try {
        const [invsRes, loansRes] = await Promise.all([
          axiosClient.get('/investments'),
          axiosClient.get('/loans')
        ]);
        setDbData({
          investments: invsRes.data || [],
          loans: loansRes.data || [],
          loading: false,
          error: ''
        });
      } catch (err) {
        console.error('Error fetching data for net worth calculator:', err.message);
        setDbData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch active database records'
        }));
      }
    };

    if (activeTab === 'networth') {
      fetchDbData();
    }
  }, [activeTab]);

  // Calculator State Variables
  // 1. SIP
  const [sipAmt, setSipAmt] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');

  // 2. EMI
  const [emiLoan, setEmiLoan] = useState('1000000');
  const [emiRate, setEmiRate] = useState('9');
  const [emiYears, setEmiYears] = useState('15');

  // 3. FD
  const [fdPrincipal, setFdPrincipal] = useState('100000');
  const [fdRate, setFdRate] = useState('7');
  const [fdYears, setFdYears] = useState('5');

  // 4. RD
  const [rdMonthly, setRdMonthly] = useState('5000');
  const [rdRate, setRdRate] = useState('6.5');
  const [rdMonths, setRdMonths] = useState('60');

  // 5. Retirement
  const [retAge, setRetAge] = useState('25');
  const [retTargetAge, setRetTargetAge] = useState('60');
  const [retExpenses, setRetExpenses] = useState('30000');
  const [retInflation, setRetInflation] = useState('6');

  // 6. Tax
  const [taxIncome, setTaxIncome] = useState('1200000');

  // 7. Emergency Fund
  const [emerRent, setEmerRent] = useState('15000');
  const [emerFood, setEmerFood] = useState('10000');
  const [emerUtilities, setEmerUtilities] = useState('5000');
  const [emerEmi, setEmerEmi] = useState('0');
  const [emerMonths, setEmerMonths] = useState('6');

  // 8. Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState('10000');
  const [ciRate, setCiRate] = useState('8');
  const [ciYears, setCiYears] = useState('5');
  const [ciFreq, setCiFreq] = useState('12'); // Monthly compounding default

  // ==========================================
  // Calculations Functions
  // ==========================================
  
  // 1. SIP
  const calcSip = () => {
    const P = parseFloat(sipAmt) || 0;
    const r = (parseFloat(sipRate) / 12) / 100;
    const n = (parseFloat(sipYears) || 0) * 12;
    if (r === 0) return { invested: P * n, total: P * n, returns: 0 };

    const total = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const invested = P * n;
    return {
      invested,
      total,
      returns: total - invested
    };
  };

  // 2. EMI
  const calcEmi = () => {
    const P = parseFloat(emiLoan) || 0;
    const r = (parseFloat(emiRate) / 12) / 100;
    const n = (parseFloat(emiYears) || 0) * 12;
    if (r === 0 || n === 0) return { emi: 0, interest: 0, total: P };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return {
      emi,
      total,
      interest: total - P
    };
  };

  // 3. FD
  const calcFd = () => {
    const P = parseFloat(fdPrincipal) || 0;
    const r = (parseFloat(fdRate) || 0) / 100;
    const n = parseFloat(fdYears) || 0;

    // Quarterly compounding is standard for FDs in India (4 times a year)
    const total = P * Math.pow(1 + r / 4, 4 * n);
    return {
      invested: P,
      total,
      interest: total - P
    };
  };

  // 4. RD
  const calcRd = () => {
    const P = parseFloat(rdMonthly) || 0;
    const r = (parseFloat(rdRate) || 0) / 100;
    const n = parseFloat(rdMonths) || 0;
    const t = n / 12;

    if (r === 0) return { invested: P * n, total: P * n, interest: 0 };

    // Standard formula: M = P * [ ((1 + r/4)^(4*t) - 1) / (1 - (1 + r/4)^(-1/3)) ]
    const i = r / 4;
    const total = P * ((Math.pow(1 + i, 4 * t) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
    const invested = P * n;
    return {
      invested,
      total,
      interest: total - invested
    };
  };

  // 5. Retirement
  const calcRetirement = () => {
    const age = parseInt(retAge) || 0;
    const targetAge = parseInt(retTargetAge) || 0;
    const expenses = parseFloat(retExpenses) || 0;
    const inflation = (parseFloat(retInflation) || 0) / 100;
    const yearsToRetire = targetAge - age;

    if (yearsToRetire <= 0) return { corpus: 0, monthlySavingRequired: 0 };

    // Adjusted expenses at retirement
    const inflationAdjustedExpenses = expenses * Math.pow(1 + inflation, yearsToRetire);

    // Corpus needed assuming 30 years post retirement and expected return beats inflation by 2%
    // Standard rule of thumb: 20x annual expenses at retirement
    const corpus = inflationAdjustedExpenses * 12 * 20;

    // Monthly savings required (assuming 10% expected return on savings)
    const monthlyRate = 0.10 / 12;
    const months = yearsToRetire * 12;
    const monthlySavingRequired = (corpus * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1);

    return {
      adjustedExpenses: inflationAdjustedExpenses,
      corpus,
      monthlySavingRequired
    };
  };

  // 6. Tax
  const calcTax = () => {
    const income = parseFloat(taxIncome) || 0;
    const standardDeduction = 75000; // FY 2024-25 Indian Budget standard deduction
    const taxableIncome = Math.max(0, income - standardDeduction);

    let tax = 0;

    // Slabs under New Tax Regime FY 2024-25:
    // Up to 3L: Nil
    // 3L to 6L: 5%
    // 6L to 9L: 10%
    // 9L to 12L: 15%
    // 12L to 15L: 20%
    // Above 15L: 30%
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.30;
      tax += 300000 * 0.20; // 12L-15L
      tax += 300000 * 0.15; // 9L-12L
      tax += 300000 * 0.10; // 6L-9L
      tax += 300000 * 0.05; // 3L-6L
    } else if (taxableIncome > 1200000) {
      tax += (taxableIncome - 1200000) * 0.20;
      tax += 300000 * 0.15;
      tax += 300000 * 0.10;
      tax += 300000 * 0.05;
    } else if (taxableIncome > 900000) {
      tax += (taxableIncome - 900000) * 0.15;
      tax += 300000 * 0.10;
      tax += 300000 * 0.05;
    } else if (taxableIncome > 600000) {
      tax += (taxableIncome - 600000) * 0.10;
      tax += 300000 * 0.05;
    } else if (taxableIncome > 300000) {
      tax += (taxableIncome - 300000) * 0.05;
    }

    // Cess of 4%
    const finalTax = tax * 1.04;
    return {
      taxableIncome,
      tax: finalTax,
      netIncome: income - finalTax
    };
  };

  // 7. Emergency Fund
  const calcEmergency = () => {
    const rent = parseFloat(emerRent) || 0;
    const food = parseFloat(emerFood) || 0;
    const utilities = parseFloat(emerUtilities) || 0;
    const emi = parseFloat(emerEmi) || 0;
    const months = parseInt(emerMonths) || 6;

    const monthlyTotal = rent + food + utilities + emi;
    return {
      monthlyTotal,
      target: monthlyTotal * months
    };
  };

  // 8. Compound Interest
  const calcCompound = () => {
    const P = parseFloat(ciPrincipal) || 0;
    const r = (parseFloat(ciRate) || 0) / 100;
    const t = parseFloat(ciYears) || 0;
    const n = parseInt(ciFreq) || 12;

    const total = P * Math.pow(1 + r / n, n * t);
    return {
      invested: P,
      total,
      interest: total - P
    };
  };

  // 9. Net Worth
  const calcNetWorth = () => {
    const { investments, loans } = dbData;

    const sips = investments.filter(inv => inv.type === 'mutual_fund');
    const stocks = investments.filter(inv => inv.type === 'stock');
    const fds = investments.filter(inv => inv.type === 'fixed_deposit');

    const totalSips = sips.reduce((acc, curr) => acc + curr.amount, 0);
    const totalStocks = stocks.reduce((acc, curr) => acc + (curr.quantity * (curr.currentValue || curr.amount)), 0);
    const totalFds = fds.reduce((acc, curr) => acc + curr.amount, 0);

    const totalAssets = totalSips + totalStocks + totalFds;
    const totalLiabilities = loans.reduce((acc, curr) => acc + curr.outstanding, 0);

    return {
      totalSips,
      totalStocks,
      totalFds,
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities
    };
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="text-blue-600 w-7 h-7" />
          Financial Planning Calculators
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Perform financial estimations and project compound returns to secure your future.
        </p>
      </div>

      {/* Calculator Tab Selection Row */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100">
        {[
          { id: 'sip', name: 'SIP' },
          { id: 'emi', name: 'Loan EMI' },
          { id: 'fd', name: 'Fixed Deposit' },
          { id: 'rd', name: 'Recurring Deposit' },
          { id: 'retirement', name: 'Retirement' },
          { id: 'tax', name: 'Income Tax' },
          { id: 'emergency', name: 'Emergency Fund' },
          { id: 'compound', name: 'Compound Interest' },
          { id: 'networth', name: 'Net Worth Sheet' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Calculator Body Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Input Panel (Col span 2) */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Parameters Input</h3>
          
          {/* SIP Tab */}
          {activeTab === 'sip' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Monthly SIP (₹)</label>
                <input
                  type="number"
                  value={sipAmt}
                  onChange={(e) => setSipAmt(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Expected Return Rate (% p.a.)</label>
                <input
                  type="number"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Tenure (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* EMI Tab */}
          {activeTab === 'emi' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Loan Principal (₹)</label>
                <input
                  type="number"
                  value={emiLoan}
                  onChange={(e) => setEmiLoan(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={emiRate}
                  onChange={(e) => setEmiRate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Tenure (Years)</label>
                <input
                  type="number"
                  value={emiYears}
                  onChange={(e) => setEmiYears(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* FD Tab */}
          {activeTab === 'fd' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Principal Deposit (₹)</label>
                <input
                  type="number"
                  value={fdPrincipal}
                  onChange={(e) => setFdPrincipal(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={fdRate}
                  onChange={(e) => setFdRate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Tenure (Years)</label>
                <input
                  type="number"
                  value={fdYears}
                  onChange={(e) => setFdYears(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* RD Tab */}
          {activeTab === 'rd' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Monthly Deposit (₹)</label>
                <input
                  type="number"
                  value={rdMonthly}
                  onChange={(e) => setRdMonthly(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={rdRate}
                  onChange={(e) => setRdRate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Tenure (Months)</label>
                <input
                  type="number"
                  value={rdMonths}
                  onChange={(e) => setRdMonths(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* Retirement Tab */}
          {activeTab === 'retirement' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Current Age</label>
                <input
                  type="number"
                  value={retAge}
                  onChange={(e) => setRetAge(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Retirement Age</label>
                <input
                  type="number"
                  value={retTargetAge}
                  onChange={(e) => setRetTargetAge(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Current Monthly Exp (₹)</label>
                <input
                  type="number"
                  value={retExpenses}
                  onChange={(e) => setRetExpenses(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Inflation Rate (%)</label>
                <input
                  type="number"
                  value={retInflation}
                  onChange={(e) => setRetInflation(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* Tax Tab */}
          {activeTab === 'tax' && (
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold">Gross Annual Salary (₹)</label>
              <input
                type="number"
                value={taxIncome}
                onChange={(e) => setTaxIncome(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 w-full sm:w-80"
              />
              <p className="text-[10px] text-slate-400 mt-1">Calculates tax based on the FY 2024-25 Indian Budget New Tax slabs, applying standard deduction (₹75k).</p>
            </div>
          )}

          {/* Emergency Fund Tab */}
          {activeTab === 'emergency' && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Rent (₹)</label>
                <input
                  type="number"
                  value={emerRent}
                  onChange={(e) => setEmerRent(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Food/Groceries (₹)</label>
                <input
                  type="number"
                  value={emerFood}
                  onChange={(e) => setEmerFood(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Utilities/Bills (₹)</label>
                <input
                  type="number"
                  value={emerUtilities}
                  onChange={(e) => setEmerUtilities(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Loan EMIs (₹)</label>
                <input
                  type="number"
                  value={emerEmi}
                  onChange={(e) => setEmerEmi(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Coverage (Months)</label>
                <select
                  value={emerMonths}
                  onChange={(e) => setEmerMonths(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
              </div>
            </div>
          )}

          {/* Compound Interest Tab */}
          {activeTab === 'compound' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Principal (₹)</label>
                <input
                  type="number"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Interest Rate (%)</label>
                <input
                  type="number"
                  value={ciRate}
                  onChange={(e) => setCiRate(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Years</label>
                <input
                  type="number"
                  value={ciYears}
                  onChange={(e) => setCiYears(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold">Compounding Freq.</label>
                <select
                  value={ciFreq}
                  onChange={(e) => setCiFreq(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                >
                  <option value="12">Monthly</option>
                  <option value="4">Quarterly</option>
                  <option value="2">Half-Yearly</option>
                  <option value="1">Yearly</option>
                </select>
              </div>
            </div>
          )}

          {/* Net Worth Tab */}
          {activeTab === 'networth' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                This sheet fetches active investments (SIPs, Stocks, and Fixed Deposits) and outstanding loan balances directly from your live database.
              </p>
              {dbData.loading && (
                <div className="flex items-center space-x-2 text-blue-600 text-xs py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading database ledger...</span>
                </div>
              )}
              {dbData.error && (
                <div className="text-rose-500 text-xs flex items-center space-x-1.5 py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{dbData.error}</span>
                </div>
              )}
              {!dbData.loading && !dbData.error && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Active Stock Portfolios:</span>
                    <span className="text-slate-800">₹{calcNetWorth().totalStocks.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Active Mutual Fund SIPs:</span>
                    <span className="text-slate-800">₹{calcNetWorth().totalSips.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Active Fixed Deposits:</span>
                    <span className="text-slate-800">₹{calcNetWorth().totalFds.toLocaleString('en-IN')}</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Total Assets:</span>
                    <span className="text-blue-700">₹{calcNetWorth().totalAssets.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Total Liabilities:</span>
                    <span className="text-rose-600">₹{calcNetWorth().totalLiabilities.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Panel (Col span 1) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">Calculated Output</h3>
          
          <div className="flex-1 flex flex-col justify-center space-y-5">
            {/* SIP Results */}
            {activeTab === 'sip' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Invested Amount:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcSip().invested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Est. Returns:</span>
                  <span className="text-sm font-bold text-blue-600">+₹{calcSip().returns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Maturity Value:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcSip().total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* EMI Results */}
            {activeTab === 'emi' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Monthly EMI:</span>
                  <span className="text-sm font-bold text-blue-600">₹{calcEmi().emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Total Interest:</span>
                  <span className="text-sm font-bold text-rose-500">₹{calcEmi().interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Total Payment:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcEmi().total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* FD Results */}
            {activeTab === 'fd' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Invested:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcFd().invested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Interest Yield:</span>
                  <span className="text-sm font-bold text-blue-600">+₹{calcFd().interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Maturity Value:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcFd().total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* RD Results */}
            {activeTab === 'rd' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Invested:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcRd().invested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Interest Yield:</span>
                  <span className="text-sm font-bold text-blue-600">+₹{calcRd().interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Maturity Value:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcRd().total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* Retirement Results */}
            {activeTab === 'retirement' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Adjusted Exp. (Monthly):</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcRetirement().adjustedExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Target Corpus:</span>
                  <span className="text-sm font-bold text-blue-600">₹{calcRetirement().corpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Monthly Savings Needed:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcRetirement().monthlySavingRequired.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* Tax Results */}
            {activeTab === 'tax' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Taxable Income:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcTax().taxableIncome.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Estimated Income Tax:</span>
                  <span className="text-sm font-bold text-rose-500">₹{calcTax().tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Net Take-Home Salary:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcTax().netIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* Emergency Results */}
            {activeTab === 'emergency' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Core Monthly Outflow:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcEmergency().monthlyTotal.toLocaleString('en-IN')}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Target Emergency Fund:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcEmergency().target.toLocaleString('en-IN')}</span>
                </div>
              </>
            )}

            {/* Compound Results */}
            {activeTab === 'compound' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Invested:</span>
                  <span className="text-sm font-bold text-slate-700">₹{calcCompound().invested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Interest Earned:</span>
                  <span className="text-sm font-bold text-blue-600">+₹{calcCompound().interest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Future Value:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcCompound().total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </>
            )}

            {/* Net Worth Results */}
            {activeTab === 'networth' && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Total Assets:</span>
                  <span className="text-sm font-bold text-blue-600">₹{calcNetWorth().totalAssets.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Total Liabilities:</span>
                  <span className="text-sm font-bold text-rose-500">₹{calcNetWorth().totalLiabilities.toLocaleString('en-IN')}</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-700 font-bold">Calculated Net Worth:</span>
                  <span className="text-base font-extrabold text-blue-900">₹{calcNetWorth().netWorth.toLocaleString('en-IN')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;
