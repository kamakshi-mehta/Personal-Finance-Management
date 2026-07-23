import React from 'react';
import { Landmark, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

const MutualFunds = () => {
  const activeSips = [
    { id: 1, name: 'Bluechip Equity Growth Fund', amount: 5000, frequency: 'Monthly', nextDate: 'Aug 05, 2026', yield: '+14.2% annualized' },
    { id: 2, name: 'Index Nifty 50 Fund', amount: 3000, frequency: 'Monthly', nextDate: 'Aug 12, 2026', yield: '+12.8% annualized' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Landmark className="text-blue-600 w-7 h-7" />
          Mutual Funds & SIPs
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Track your systemic investment plans and mutual fund holdings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Mutual Fund Value</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹1,45,000.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4 font-medium flex items-center">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            Includes ₹8,000 monthly active SIP contributions
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Monthly SIP</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹8,000.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Next SIP auto-debit scheduled for Aug 05, 2026
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">My Active SIPs</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Fund Name</th>
              <th className="table-header-cell">SIP Amount</th>
              <th className="table-header-cell">Frequency</th>
              <th className="table-header-cell">Next Date</th>
              <th className="table-header-cell text-right">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeSips.map((sip) => (
              <tr key={sip.id} className="table-row">
                <td className="p-4 font-medium text-slate-800 text-sm">{sip.name}</td>
                <td className="p-4 text-sm text-slate-700 font-semibold">₹{sip.amount}</td>
                <td className="table-cell">{sip.frequency}</td>
                <td className="p-4 text-sm text-slate-400">{sip.nextDate}</td>
                <td className="p-4 text-sm font-semibold text-right text-blue-600">{sip.yield}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MutualFunds;