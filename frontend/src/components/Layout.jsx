import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Cpu, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Offline
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-slate-400 border border-slate-700/50 animate-pulse">
            Checking...
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950 text-amber-300 border border-amber-500/30">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Error
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-emerald-500 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/10">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent m-0">
              WealthAI
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Personal Finance Manager
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[10px] text-slate-500 font-medium">SYSTEM CONNECTIVITY</span>
            <button 
              onClick={checkConnections} 
              disabled={loading}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer disabled:opacity-50 mt-0.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Sync Status
            </button>
          </div>
          
          <div className="flex space-x-4 bg-slate-950/60 p-2 rounded-xl border border-slate-900">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">API Gateway</span>
              {getStatusBadge(backendStatus)}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">Database</span>
              {getStatusBadge(dbStatus)}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">AI Engine</span>
              {getStatusBadge(aiStatus)}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 border-r border-slate-900 bg-slate-950/30 p-4 space-y-2 flex flex-row md:flex-col justify-around md:justify-start">
          <Link
            to="/"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/'
                ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link
            to="/transactions"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/transactions'
                ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-medium text-sm">Transactions</span>
          </Link>

          <Link
            to="/ai-insights"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 \${
              location.pathname === '/ai-insights'
                ? 'bg-gradient-to-r from-emerald-500/10 to-transparent text-emerald-400 border-l-2 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="font-medium text-sm">AI Insights</span>
          </Link>
        </aside>

        <main className="flex-1 p-6 md:p-8 bg-gradient-to-tr from-slate-950 to-slate-900/40 overflow-y-auto">
          <div className="flex md:hidden flex-wrap gap-3 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-900 justify-around">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">API:</span>
              {getStatusBadge(backendStatus)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">DB:</span>
              {getStatusBadge(dbStatus)}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">AI:</span>
              {getStatusBadge(aiStatus)}
            </div>
          </div>

          <Outlet />
        </main>
      </div>

      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        WealthAI Boilerplate Setup © 2026 • Live Microservice Communication Active
      </footer>
    </div>
  );
};

export default Layout;