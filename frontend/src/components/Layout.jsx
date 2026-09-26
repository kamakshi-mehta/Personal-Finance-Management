import React, { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Receipt, Cpu, Coins, PiggyBank, Landmark, Percent, TrendingUp, IndianRupee, Wallet, User, Calculator, FileText, LogOut
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="theme-container">
      
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
      <header className="theme-header">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Personal Finance Logo" className="w-10 h-10 object-contain rounded-xl shadow-xs" />
          <div>
            <h1 className="logo-text">
              WealthAI
            </h1>
            <p className="logo-subtext">
              Simple Money & Investment Manager
            </p>
          </div>
        </div>

        {/* User Info & Sign Out Button on the Right */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-right">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'Kamakshi Mehta'}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {user?.email || 'kamakshi@example.com'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center shadow-xs">
              {(user?.name ? user.name[0] : 'K').toUpperCase()}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
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