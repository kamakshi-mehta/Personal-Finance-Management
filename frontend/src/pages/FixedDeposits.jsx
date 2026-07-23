import React from 'react';
import { Landmark, Calendar, Percent, ArrowUpRight } from 'lucide-react';

const FixedDeposits = () => {
  const activeFds = [
    { id: 1, bankName: 'HDFC Bank Fixed Deposit', principal: 150000, interestRate: '7.10%', maturityDate: 'Dec 15, 2026', interestPayout: 'On Maturity' },
    { id: 2, bankName: 'State Bank of India FD', principal: 100000, interestRate: '6.85%', maturityDate: 'Mar 24, 2027', interestPayout: 'Quarterly' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Landmark className="text-blue-600 w-7 h-7" />
          Fixed Deposits (FD)
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor your safe, fixed-interest bank deposits and maturity dates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total FD Investments</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹2,50,000.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            Average Yield Rate: 7.00%
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Projected Interest</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹17,650.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Accrued interest across all active accounts
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Active Fixed Deposits</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Bank / FD Name</th>
              <th className="table-header-cell">Principal Amount</th>
              <th className="table-header-cell">Interest Rate</th>
              <th className="table-header-cell">Maturity Date</th>
              <th className="table-header-cell text-right">Interest Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeFds.map((fd) => (
              <tr key={fd.id} className="table-row">
                <td className="p-4 font-medium text-slate-800 text-sm">{fd.bankName}</td>
                <td className="p-4 text-sm text-slate-700 font-semibold">₹{fd.principal.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-blue-600 font-semibold">{fd.interestRate}</td>
                <td className="p-4 text-sm text-slate-400">{fd.maturityDate}</td>
                <td className="p-4 text-sm text-slate-500 text-right">{fd.interestPayout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedDeposits;