import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Receipt, Cpu, CheckCircle2, XCircle, AlertCircle, RefreshCw, 
  Coins, PiggyBank, Landmark, Percent, TrendingUp, DollarSign 
} from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Layout = () => {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');
  const [dbStatus, setDbStatus] = useState('checking');
  const [aiStatus, setAiStatus] = useState('checking');
  const [loading, setLoading] = useState(false);

  const checkConnections = async () => {
    setLoading(true);
    try {
      const backendRes = await axiosClient.get('/health');
      if (backendRes.status === 200 && backendRes.data.status === 'ok') {
        setBackendStatus('connected');
        setDbStatus(backendRes.data.mongodb === 'Connected' ? 'connected' : 'disconnected');
      } else {
        setBackendStatus('error');
        setDbStatus('error');
      }
    } catch (err) {
      setBackendStatus('disconnected');
      setDbStatus('disconnected');
    }

    try {
      const aiRes = await axiosClient.get('/ai-status');
      if (aiRes.data && aiRes.data.status === 'Connected') {
        setAiStatus('connected');
      } else {
        setAiStatus('disconnected');
      }
    } catch (err) {
      setAiStatus('disconnected');
    }
    setLoading(false);
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 8000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Offline
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-400 border border-slate-100/50 animate-pulse">
            Checking...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Error
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden">
      
      {/* Subtle Floating Money/Investment Symbols in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <TrendingUp className="absolute top-[12%] left-[4%] w-20 h-20 text-blue-500/5 rotate-12" />
        <PiggyBank className="absolute bottom-[12%] right-[5%] w-24 h-24 text-blue-500/4 -rotate-12" />
        <Landmark className="absolute top-[45%] left-[2%] w-16 h-16 text-blue-500/5 rotate-[20deg]" />
        <Coins className="absolute top-[18%] right-[8%] w-20 h-20 text-blue-500/4 -rotate-45" />
        <DollarSign className="absolute bottom-[18%] left-[6%] w-28 h-28 text-blue-500/3 rotate-[15deg]" />
        <Percent className="absolute top-[58%] right-[3%] w-14 h-14 text-blue-500/5 rotate-12" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm relative">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent m-0">
              WealthAI
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
              Personal Finance Manager
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] text-slate-400 font-medium">SYSTEM CONNECTIVITY</span>
            <button 
              onClick={checkConnections} 
              disabled={loading}
              className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer disabled:opacity-50 mt-0.5 font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Sync Status
            </button>
          </div>
          
          <div className="flex space-x-4 bg-slate-100/50 p-2 rounded-xl border border-slate-200/60">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-500 px-1 font-semibold uppercase">API Gateway</span>
              {getStatusBadge(backendStatus)}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-500 px-1 font-semibold uppercase">Database</span>
              {getStatusBadge(dbStatus)}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-500 px-1 font-semibold uppercase">AI Engine</span>
              {getStatusBadge(aiStatus)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 border-r border-slate-200 bg-white/40 backdrop-blur-sm p-4 space-y-2 flex flex-row md:flex-col justify-around md:justify-start">
          <Link
            to="/"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/'
                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link
            to="/transactions"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/transactions'
                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-medium text-sm">Transactions</span>
          </Link>

          <Link
            to="/ai-insights"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/ai-insights'
                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="font-medium text-sm">AI Insights</span>
          </Link>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {/* Mobile status indicators */}
          <div className="flex md:hidden flex-wrap gap-3 mb-6 bg-white/60 p-3 rounded-xl border border-slate-200 justify-around shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">API:</span>
              {getStatusBadge(backendStatus)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">DB:</span>
              {getStatusBadge(dbStatus)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">AI:</span>
              {getStatusBadge(aiStatus)}
            </div>
          </div>

          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 relative z-20">
        WealthAI Boilerplate Setup © 2026 • Live Microservice Communication Active
      </footer>
    </div>
  );
};

export default Layout;