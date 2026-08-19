import React, { useContext, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Receipt, Cpu, Coins, PiggyBank, Landmark, Percent, TrendingUp, IndianRupee, Wallet, User, Calculator, FileText
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('wealth_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('wealth_dark_mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`theme-container ${darkMode ? 'dark-theme' : ''}`}>
      
      {/* Subtle Floating Money/Investment Symbols in Background */}
      <div className="bg-symbols-layer">
        <TrendingUp className="absolute top-[12%] left-[4%] w-20 h-20 text-blue-500/5 rotate-12" />
        <PiggyBank className="absolute bottom-[12%] right-[5%] w-24 h-24 text-blue-500/4 -rotate-12" />
        <Landmark className="absolute top-[45%] left-[2%] w-16 h-16 text-blue-500/5 rotate-[20deg]" />
        <Coins className="absolute top-[18%] right-[8%] w-20 h-20 text-blue-500/4 -rotate-45" />
        <IndianRupee className="absolute bottom-[18%] left-[6%] w-28 h-28 text-blue-500/3 rotate-[15deg]" />
        <Percent className="absolute top-[58%] right-[3%] w-14 h-14 text-blue-500/5 rotate-12" />
      </div>

      {/* Header */}
      <header className="theme-header flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="logo-accent">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="logo-text">
              WealthAI
            </h1>
            <p className="logo-subtext">
              Simple Money & Investment Manager
            </p>
          </div>
        </div>

        {/* Simple Theme Toggle Switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Navigation Sidebar */}
        <aside className="sidebar-container bg-white/60 flex flex-col">
          <div className="flex-1 flex flex-col space-y-1">
            <Link
              to="/"
              className={location.pathname === '/' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium text-sm">My Dashboard</span>
            </Link>

            <Link
              to="/mutual-funds"
              className={location.pathname === '/mutual-funds' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Landmark className="w-5 h-5" />
              <span className="font-medium text-sm">Mutual Funds & SIP</span>
            </Link>

            <Link
              to="/stocks"
              className={location.pathname === '/stocks' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium text-sm">Stock Market</span>
            </Link>

            <Link
              to="/fixed-deposits"
              className={location.pathname === '/fixed-deposits' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Coins className="w-5 h-5" />
              <span className="font-medium text-sm">Fixed Deposits (FD)</span>
            </Link>

            <Link
              to="/loans"
              className={location.pathname === '/loans' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Percent className="w-5 h-5" />
              <span className="font-medium text-sm">Loans & EMIs</span>
            </Link>

            <Link
              to="/budget"
              className={location.pathname === '/budget' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Wallet className="w-5 h-5" />
              <span className="font-medium text-sm">Budget Planning</span>
            </Link>

            <Link
              to="/transactions"
              className={location.pathname === '/transactions' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Receipt className="w-5 h-5" />
              <span className="font-medium text-sm">All Transactions</span>
            </Link>

            <Link
              to="/calculators"
              className={location.pathname === '/calculators' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Calculator className="w-5 h-5" />
              <span className="font-medium text-sm">Calculators</span>
            </Link>

            <Link
              to="/reports"
              className={location.pathname === '/reports' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Financial Reports</span>
            </Link>

            <Link
              to="/ai-insights"
              className={location.pathname === '/ai-insights' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <Cpu className="w-5 h-5" />
              <span className="font-medium text-sm">Smart AI Insights</span>
            </Link>

            <Link
              to="/profile"
              className={location.pathname === '/profile' ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <User className="w-5 h-5" />
              <span className="font-medium text-sm">My Profile</span>
            </Link>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="mt-auto border-t border-slate-100 pt-4 pb-2 px-1 flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full text-left py-1.5 px-3 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-slate-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </aside>

        {/* Content Outlet */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="footer-container">
        WealthAI • Simple Personal Finance Management
      </footer>
    </div>
  );
};

export default Layout;