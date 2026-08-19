import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Cpu, Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setResetUrl('');

    if (!email) {
      return setError('Please enter your email address');
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/auth/forgot-password', { email });
      setSuccess(true);
      if (res.data && res.data.resetLink) {
        setResetUrl(res.data.resetLink);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check the email and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative px-4 overflow-hidden">
      {/* Background Graphic Symbols */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl font-extrabold select-none">₹</div>
        <div className="absolute bottom-10 right-10 text-9xl font-extrabold select-none">₹</div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative z-10 space-y-6">
        {/* Header/Logo */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="logo-accent p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Cpu className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Your Password</h2>
          <p className="text-sm text-slate-500">Provide your email address to generate a recovery link</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-start space-x-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-xl space-y-3">
            <div className="flex items-start space-x-2 text-xs font-semibold">
              <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-blue-600 flex-shrink-0" />
              <span>Password recovery link generated successfully!</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              For testing convenience, the recovery link has been printed to the Node.js server console. You can also click the quick access link below to reset your password immediately:
            </p>
            {resetUrl && (
              <a
                href={resetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-blue-600 underline hover:text-blue-800 break-all"
              >
                {resetUrl}
              </a>
            )}
          </div>
        )}

        {/* Forgot Password Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-slate-50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md shadow-blue-500/10 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Requesting link...
                </>
              ) : (
                'Request Reset Link'
              )}
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600 gap-1.5 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
