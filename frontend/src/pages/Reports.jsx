import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Loader2, AlertCircle, TrendingUp, Calendar, ShieldCheck, ShoppingCart } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loans, setLoans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError('');
      try {
        const [txsRes, invsRes, loansRes] = await Promise.all([
          axiosClient.get('/transactions', { params: { limit: 200 } }),
          axiosClient.get('/investments'),
          axiosClient.get('/loans')
        ]);
        setTransactions(txsRes.data.transactions || []);
        setInvestments(invsRes.data || []);
        setLoans(loansRes.data || []);
      } catch (err) {
        console.error('Error fetching report data:', err.message);
        setError('Failed to load database records for report generation');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // calculations
  const totalInflow = transactions
    .filter(tx => tx.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOutflow = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvested = investments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDebt = loans.reduce((acc, curr) => acc + curr.outstanding, 0);

  // CSV Export utility
  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Description,Category,Type,Amount,Date\n'];
    const rows = transactions.map(tx => {
      const cleanDesc = tx.description.replace(/"/g, '""');
      const cleanCat = tx.category.replace(/"/g, '""');
      return `"${cleanDesc}","${cleanCat}","${tx.type}",${tx.amount},"${new Date(tx.date).toLocaleDateString()}"`;
    });

    const csvContent = headers.concat(rows.join('\n')).join('');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `WealthAI_Finance_Report_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Print utility
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
        <span className="text-slate-500 text-sm font-semibold">Generating financial reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4 print:p-4">
      {/* Title / Action bar */}
      <div className="flex justify-between items-center print:border-b print:pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 print:text-lg">
            <FileText className="text-blue-600 w-7 h-7 print:w-5 print:h-5" />
            Financial Statements & Reports
          </h2>
          <p className="text-slate-500 text-sm mt-1 print:hidden">
            Analyze consolidated financial activities and export standard logs.
          </p>
          {/* Printable Statement Header */}
          <p className="hidden print:block text-xs text-slate-400 mt-1">
            WealthAI Official Personal Statement - Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium print:hidden">
          <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm print:border-slate-300">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Income Inflow</p>
          <p className="text-lg font-bold text-blue-700 mt-1">₹{totalInflow.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm print:border-slate-300">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Expense Outflow</p>
          <p className="text-lg font-bold text-indigo-500 mt-1">₹{totalOutflow.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm print:border-slate-300">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Invested Assets</p>
          <p className="text-lg font-bold text-slate-800 mt-1">₹{totalInvested.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm print:border-slate-300">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding Liabilities</p>
          <p className="text-lg font-bold text-rose-600 mt-1">₹{totalDebt.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Statement Ledger Records</h3>
        
        <div className="table-container print:border-slate-300 print:shadow-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header-row print:bg-slate-50">
                <th className="table-header-cell print:text-slate-800">Description</th>
                <th className="table-header-cell print:text-slate-800">Category</th>
                <th className="table-header-cell print:text-slate-800">Date</th>
                <th className="table-header-cell print:text-slate-800">Type</th>
                <th className="table-header-cell print:text-slate-800">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                    No transactions available for statement output.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx._id} className="table-row print:hover:bg-transparent">
                      <td className="p-4 text-sm font-medium text-slate-800">{tx.description}</td>
                      <td className="table-cell">{tx.category}</td>
                      <td className="p-4 text-sm text-slate-400">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="table-cell">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 print:text-xs">
                          {tx.type}
                        </span>
                      </td>
                      <td className={`p-4 text-sm font-semibold ${isIncome ? 'text-blue-700' : 'text-slate-700'}`}>
                        {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
