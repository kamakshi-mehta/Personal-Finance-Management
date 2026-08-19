import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Loader2, AlertCircle, CheckCircle2, Cpu } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Sync state with context user details on load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email) {
      return setError('Name and email are required fields');
    }

    if (password && password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    if (password && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setSubmitting(true);
    const profileData = { name, email, phone };
    if (password) {
      profileData.password = password;
    }

    const result = await updateProfile(profileData);
    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  const handleSeedDemoData = async () => {
    setError('');
    setSuccess(false);
    setSeeding(true);
    try {
      await axiosClient.post('/seed');
      setSuccess(true);
      alert('Middle-class family sample financial figures loaded successfully! You can now view and modify them across all ledger pages.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Failed to seed sandbox simulation data');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="text-blue-600 w-7 h-7" />
          My Profile Management
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          View and update your personal settings, password, and contact coordinates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile Edit Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Error alert */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
              <AlertCircle className="w-4.5 h-4.5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success alert */}
          {success && (
            <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-semibold">
              <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-blue-600 flex-shrink-0" />
              <span>Operation processed successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 md:col-span-2">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. +91 9429687132"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 my-4" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Change Password (Optional)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Profile Settings'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Seed Simulation Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="text-blue-600 w-4 h-4" /> Middle-Class Simulation Sandbox
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instantly seed mock data representing a typical middle-class family earning <strong>₹60,000</strong> a month. 
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            This setup populates salary income, rent, grocery bills, educational fees, utilities, mutual fund SIPs, fixed deposits, stocks, two-wheeler loan EMIs, category budgets, and savings milestones.
          </p>
          <p className="text-[10px] text-blue-600 font-semibold leading-relaxed">
            *Note: These inputs are not permanent. You can edit, modify, or delete any of these values on their respective pages (Transactions, Budgets, Stocks, etc.) at any time.
          </p>
          <button
            onClick={handleSeedDemoData}
            disabled={seeding}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            {seeding ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Seeding Sandbox...
              </>
            ) : (
              'Load Middle-Class Demo Data'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
