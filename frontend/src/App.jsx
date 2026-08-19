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
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Calculators from './pages/Calculators';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="mutual-funds" element={<MutualFunds />} />
              <Route path="stocks" element={<StockMarket />} />
              <Route path="fixed-deposits" element={<FixedDeposits />} />
              <Route path="loans" element={<Loans />} />
              <Route path="budget" element={<BudgetPlanning />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="ai-insights" element={<AiInsights />} />
              <Route path="calculators" element={<Calculators />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;