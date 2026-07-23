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
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="text-blue-600 w-7 h-7" />
          AI Microservice & System Status
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Verify data communication flow: Frontend (Vite) ⇄ Backend (Express) ⇄ AI Service (FastAPI).
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 cursor-pointer transition-all duration-300"
        >
          <RefreshCw className={`w-4 h-4 \${loading ? 'animate-spin' : ''}`} />
          Test System Communication
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Express Response Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Layers className="text-blue-500 w-4 h-4" />
              Express Backend Health Check
            </span>
            <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200/50">
              GET /api/health
            </span>
          </div>

          <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto min-h-[160px] flex items-center justify-center">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Requesting backend...</span>
            ) : backendResponse ? (
              <pre className="w-full text-left">{JSON.stringify(backendResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">No data. Click Test Connection to initiate.</span>
            )}
          </div>
        </div>

        {/* FastAPI Response Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Sparkles className="text-blue-500 w-4 h-4" />
              FastAPI AI Communication Check
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/50">
              GET /api/ai-status
            </span>
          </div>

          <div className="flex-1 bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto min-h-[160px] flex items-center justify-center">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Pinging FastAPI via Express...</span>
            ) : aiResponse ? (
              <pre className="w-full text-left">{JSON.stringify(aiResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">No data. Click Test Connection to initiate.</span>
            )}
          </div>
        </div>
      </div>

      {/* Simple AI Insight simulation */}
      <div className="bg-gradient-to-r from-blue-50/50 via-white to-slate-100/50 p-6 rounded-2xl border border-slate-200/80 flex flex-col space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="text-blue-600 w-4.5 h-4.5" />
          AI Microservice Capabilities
        </h3>
        <p className="text-xs text-slate-500">
          The FastAPI microservice is listening on port <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-100/40">8000</code> and CORS is open for connection. When you proceed with Phase 2, you can create Python scripts to invoke generative financial analyses, forecast remaining balance based on MERN data, and push the calculations back into your Express API.
        </p>
      </div>
    </div>
  );
};

export default AiInsights;