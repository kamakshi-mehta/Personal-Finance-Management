import React from 'react';
import { ArrowUpRight, ArrowDownRight, Coffee, ShieldCheck, ShoppingCart } from 'lucide-react';

const Transactions = () => {
  const mockTransactions = [
    { id: 1, desc: 'Starbucks Coffee', amount: -6.50, category: 'Food & Dining', date: 'July 01, 2026', icon: Coffee, color: 'text-amber-400 bg-amber-500/10' },
    { id: 2, desc: 'Salary Deposit', amount: 3500.00, category: 'Income', date: 'June 30, 2026', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 3, desc: 'Amazon Purchase', amount: -124.99, category: 'Shopping', date: 'June 28, 2026', icon: ShoppingCart, color: 'text-indigo-400 bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Transaction History</h2>
          <p className="text-slate-400 text-sm mt-1">Manage and monitor all incoming and outgoing funds.</p>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-4 text-xs font-semibold uppercase text-slate-400">Description</th>
              <th className="p-4 text-xs font-semibold uppercase text-slate-400">Category</th>
              <th className="p-4 text-xs font-semibold uppercase text-slate-400">Date</th>
              <th className="p-4 text-xs font-semibold uppercase text-slate-400 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {mockTransactions.map((tx) => {
              const Icon = tx.icon;
              return (
                <tr key={tx.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="p-4 flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${tx.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-200 text-sm">{tx.desc}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{tx.category}</td>
                  <td className="p-4 text-sm text-slate-500">{tx.date}</td>
                  <td className={`p-4 text-sm font-semibold text-right ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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