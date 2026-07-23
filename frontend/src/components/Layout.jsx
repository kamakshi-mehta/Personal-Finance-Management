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
          <span className="badge-connected">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Synchronized
          </span>
        );
      case 'disconnected':
        return (
          <span className="badge-disconnected">
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Offline
          </span>
        );
      case 'checking':
        return (
          <span className="badge-checking">
            Auditing...
          </span>
        );
      default:
        return (
          <span className="badge-error">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Sync Error
          </span>
        );
    }
  };

  return (
    <div className="theme-container">
      
      {/* Subtle Floating Money/Investment Symbols in Background */}
      <div className="bg-symbols-layer">
        <TrendingUp className="absolute top-[12%] left-[4%] w-20 h-20 text-blue-500/5 rotate-12" />
        <PiggyBank className="absolute bottom-[12%] right-[5%] w-24 h-24 text-blue-500/4 -rotate-12" />
        <Landmark className="absolute top-[45%] left-[2%] w-16 h-16 text-blue-500/5 rotate-[20deg]" />
        <Coins className="absolute top-[18%] right-[8%] w-20 h-20 text-blue-500/4 -rotate-45" />
        <DollarSign className="absolute bottom-[18%] left-[6%] w-28 h-28 text-blue-500/3 rotate-[15deg]" />
        <Percent className="absolute top-[58%] right-[3%] w-14 h-14 text-blue-500/5 rotate-12" />
      </div>

      {/* Header */}
      <header className="theme-header">
        <div className="flex items-center space-x-3">
          <div className="logo-accent">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="logo-text">
              WealthAI
            </h1>
            <p className="logo-subtext">
              Capital Yields & Portfolio Analyst
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex flex-col items-end mr-2">
            <span className="sync-label">PORTFOLIO DATA SYNC</span>
            <button 
              onClick={checkConnections} 
              disabled={loading}
              className="sync-button"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              Re-audit Ledger
            </button>
          </div>
          
          <div className="connection-panel">
            <div className="connection-item">
              <span className="connection-label">Asset Ledger Feed</span>
              {getStatusBadge(backendStatus)}
            </div>
            <div className="connection-item">
              <span className="connection-label">Ledger Database</span>
              {getStatusBadge(dbStatus)}
            </div>
            <div className="connection-item">
              <span className="connection-label">AI Risk Analyst</span>
              {getStatusBadge(aiStatus)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Navigation Sidebar */}
        <aside className="sidebar-container">
          <Link
            to="/"
            className={location.pathname === '/' ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Wealth Center</span>
          </Link>

          <Link
            to="/transactions"
            className={location.pathname === '/transactions' ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-medium text-sm">Ledgers & Outflows</span>
          </Link>

          <Link
            to="/ai-insights"
            className={location.pathname === '/ai-insights' ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Cpu className="w-5 h-5" />
            <span className="font-medium text-sm">Yield & Risk Models</span>
          </Link>
        </aside>

        {/* Content Outlet */}
        <main className="main-content">
          {/* Mobile status indicators */}
          <div className="mobile-badge-panel">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Ledger:</span>
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
      <footer className="footer-container">
        WealthAI Investment Suite © 2026 • Real-time Financial Ledger Synchronized
      </footer>
    </div>
  );
};

export default Layout;