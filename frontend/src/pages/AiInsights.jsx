import React, { useState, useEffect } from 'react';
import { Cpu, Send, Sparkles, Terminal, RefreshCw, Layers } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AiInsights = () => {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [backendResponse, setBackendResponse] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const bRes = await axiosClient.get('/health');
      setBackendResponse(bRes.data);
    } catch (err) {
      setBackendResponse({ error: 'Backend Offline', message: err.message });
    }

    try {
      const aRes = await axiosClient.get('/ai-status');
      setAiResponse(aRes.data);
    } catch (err) {
      setAiResponse({ error: 'AI Microservice Offline', message: err.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="text-indigo-400 w-7 h-7" />
          AI Microservice & System Status
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Verify data communication flow: Frontend (Vite) ⇄ Backend (Express) ⇄ AI Service (FastAPI).
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition-all duration-300"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Test System Communication
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="text-emerald-400 w-4 h-4" />
              Express Backend Health Check
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
              GET /api/health
            </span>
          </div>

          <div className="flex-1 bg-slate-950/80 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 overflow-x-auto min-h-[160px] flex items-center justify-center">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Requesting backend...</span>
            ) : backendResponse ? (
              <pre className="w-full text-left">{JSON.stringify(backendResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-600">No data. Click Test Connection to initiate.</span>
            )}
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="text-indigo-400 w-4 h-4" />
              FastAPI AI Communication Check
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
              GET /api/ai-status
            </span>
          </div>

          <div className="flex-1 bg-slate-950/80 p-4 rounded-xl border border-slate-900 font-mono text-xs text-slate-300 overflow-x-auto min-h-[160px] flex items-center justify-center">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Pinging FastAPI via Express...</span>
            ) : aiResponse ? (
              <pre className="w-full text-left">{JSON.stringify(aiResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-600">No data. Click Test Connection to initiate.</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-950/20 via-slate-900/40 to-slate-900/40 p-6 rounded-2xl border border-slate-900 flex flex-col space-y-3">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="text-indigo-400 w-4.5 h-4.5" />
          AI Microservice Capabilities
        </h3>
        <p className="text-xs text-slate-400">
          The FastAPI microservice is listening on port <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded">8000</code> and CORS is open for connection. When you proceed with Phase 2, you can create Python scripts to invoke generative financial analyses, forecast remaining balance based on MERN data, and push the calculations back into your Express API.
        </p>
      </div>
    </div>
  );
};

export default AiInsights;