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
      setBackendResponse({ error: 'Server Offline', message: err.message });
    }

    try {
      const aRes = await axiosClient.get('/ai-status');
      setAiResponse(aRes.data);
    } catch (err) {
      setAiResponse({ error: 'AI Service Offline', message: err.message });
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
          Smart AI & Connection Status
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Check how the frontend, backend, database, and AI service are communicating.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="test-conn-button"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Check Connections
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Express Response Card */}
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Layers className="text-blue-500 w-4 h-4" />
              Backend Connection Status
            </span>
            <span className="response-badge-express">
              Active Connection
            </span>
          </div>

          <div className="response-json-box">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Checking backend connection...</span>
            ) : backendResponse ? (
              <pre className="w-full text-left">{JSON.stringify(backendResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">No connection data. Click Check Connections to start.</span>
            )}
          </div>
        </div>

        {/* FastAPI Response Card */}
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Sparkles className="text-blue-500 w-4 h-4" />
              AI Service Connection Status
            </span>
            <span className="response-badge-fastapi">
              Active Connection
            </span>
          </div>

          <div className="response-json-box">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Checking AI service connection...</span>
            ) : aiResponse ? (
              <pre className="w-full text-left">{JSON.stringify(aiResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">No connection data. Click Check Connections to start.</span>
            )}
          </div>
        </div>
      </div>

      {/* Simple AI Insight simulation */}
      <div className="ai-simulation-card">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="text-blue-600 w-4.5 h-4.5" />
          What does this AI do?
        </h3>
        <p className="text-xs text-slate-500">
          Our AI service will analyze your spending habits, help you save more money, and give you smart budget recommendations. In the next phase, we will connect this AI engine directly with your database to give you live, personalized budget suggestions.
        </p>
      </div>
    </div>
  );
};

export default AiInsights;