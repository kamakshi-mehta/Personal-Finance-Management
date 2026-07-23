import React from 'react';
import { Wallet, Calendar, ArrowDownRight } from 'lucide-react';

const Loans = () => {
  const activeLoans = [
    { id: 1, name: 'HDFC Car Loan', totalAmount: 500000, outstanding: 320000, emi: 8500, rate: '8.75%', nextEmi: 'Aug 05, 2026' },
    { id: 2, name: 'SBI Education Loan', totalAmount: 300000, outstanding: 200000, emi: 5000, rate: '9.20%', nextEmi: 'Aug 10, 2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Wallet className="text-blue-600 w-7 h-7" />
          Loans & EMIs
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Monitor your active liabilities, outstanding dues, and monthly installments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Outstanding Debt</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹5,20,000.00</h3>
            </div>
            <div className="card-icon-wrapper-sky">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-sky-600 mt-4 font-medium flex items-center">
            <ArrowDownRight className="w-4 h-4 mr-0.5" />
            Includes HDFC Car Loan & SBI Education Loan
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Monthly EMI</p>
              <h3 className="text-3xl font-extrabold text-blue-950 mt-2">₹13,500.00</h3>
            </div>
            <div className="card-icon-wrapper-blue">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 font-medium">
            Next billing cycles starting from Aug 05
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Liabilities</h3>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Loan Account / Bank</th>
              <th className="table-header-cell">Principal Amount</th>
              <th className="table-header-cell">Outstanding Amount</th>
              <th className="table-header-cell">Monthly EMI</th>
              <th className="table-header-cell text-right">Interest Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activeLoans.map((loan) => (
              <tr key={loan.id} className="table-row">
                <td className="p-4 font-medium text-slate-800 text-sm">{loan.name}</td>
                <td className="p-4 text-sm text-slate-500">₹{loan.totalAmount.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-slate-700 font-semibold">₹{loan.outstanding.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-blue-600 font-semibold">₹{loan.emi.toLocaleString('en-IN')}</td>
                <td className="p-4 text-sm text-slate-400 text-right">{loan.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Loans;