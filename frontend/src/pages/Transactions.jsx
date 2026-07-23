import React from 'react';
import { ArrowUpRight, ArrowDownRight, Coffee, ShieldCheck, ShoppingCart } from 'lucide-react';

const Transactions = () => {
  const mockTransactions = [
    { id: 1, desc: 'Salary Bonus', amount: 45.50, category: 'Income', date: 'July 01, 2026', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border border-blue-100/50' },
    { id: 2, desc: 'Monthly Salary', amount: 3500.00, category: 'Income', date: 'June 30, 2026', icon: ShieldCheck, color: 'text-blue-700 bg-blue-50 border border-blue-100/50' },
    { id: 3, desc: 'Stock Investment (ETF)', amount: -124.99, category: 'Investments', date: 'June 28, 2026', icon: ShoppingCart, color: 'text-indigo-600 bg-indigo-50 border border-indigo-100/50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Recent Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">A history of your income and spending.</p>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">Description</th>
              <th className="table-header-cell">Category</th>
              <th className="table-header-cell">Date</th>
              <th className="table-header-cell text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockTransactions.map((tx) => {
              const Icon = tx.icon;
              return (
                <tr key={tx.id} className="table-row">
                  <td className="p-4 flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${tx.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{tx.desc}</span>
                  </td>
                  <td className="table-cell">{tx.category}</td>
                  <td className="p-4 text-sm text-slate-400">{tx.date}</td>
                  <td className={`p-4 text-sm font-semibold text-right ${tx.amount > 0 ? 'text-blue-700' : 'text-sky-600'}`}>
                    <span className="flex items-center justify-end">
                      {tx.amount > 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                      ${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;