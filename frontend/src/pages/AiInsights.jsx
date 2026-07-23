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
        <h2 className="ai-section-title">
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
          className="test-conn-button"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Test System Communication
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Express Response Card */}
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Layers className="text-blue-500 w-4 h-4" />
              Express Backend Health Check
            </span>
            <span className="response-badge-express">
              GET /api/health
            </span>
          </div>

          <div className="response-json-box">
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
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Sparkles className="text-blue-500 w-4 h-4" />
              FastAPI AI Communication Check
            </span>
            <span className="response-badge-fastapi">
              GET /api/ai-status
            </span>
          </div>

          <div className="response-json-box">
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
      <div className="ai-simulation-card">
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