import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AiInsights from './pages/AiInsights';
import MutualFunds from './pages/MutualFunds';
import StockMarket from './pages/StockMarket';
import BudgetPlanning from './pages/BudgetPlanning';
import FixedDeposits from './pages/FixedDeposits';
import Loans from './pages/Loans';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="mutual-funds" element={<MutualFunds />} />
          <Route path="stocks" element={<StockMarket />} />
          <Route path="fixed-deposits" element={<FixedDeposits />} />
          <Route path="loans" element={<Loans />} />
          <Route path="budget" element={<BudgetPlanning />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="ai-insights" element={<AiInsights />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;