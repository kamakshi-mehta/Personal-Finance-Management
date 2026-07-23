import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Receipt, Cpu, Coins, PiggyBank, Landmark, Percent, TrendingUp, IndianRupee, Wallet 
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();

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
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Navigation Sidebar */}
        <aside className="sidebar-container bg-white/60">
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
            to="/ai-insights"
            className={location.pathname === '/ai-insights' ? 'sidebar-link-active' : 'sidebar-link'}
          >
            <Cpu className="w-5 h-5" />
            <span className="font-medium text-sm">Smart AI Insights</span>
          </Link>
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