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
      setBackendResponse({ error: 'Ledger Offline', message: err.message });
    }

    try {
      const aRes = await axiosClient.get('/ai-status');
      setAiResponse(aRes.data);
    } catch (err) {
      setAiResponse({ error: 'Risk Analyst Offline', message: err.message });
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
          AI Risk Assessments & Portfolios
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Audit real-time communication feeds between your accounts, ledgers, and automated AI analysis models.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="test-conn-button"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Retrieve Real-time Risk Assessments
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Express Response Card */}
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Layers className="text-blue-500 w-4 h-4" />
              Core Ledger Database Feed (MERN)
            </span>
            <span className="response-badge-express">
              Active Feed
            </span>
          </div>

          <div className="response-json-box">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Querying ledger database...</span>
            ) : backendResponse ? (
              <pre className="w-full text-left">{JSON.stringify(backendResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">Asset data empty. Query the risk engine to fetch status.</span>
            )}
          </div>
        </div>

        {/* FastAPI Response Card */}
        <div className="response-card-wrapper">
          <div className="response-card-header">
            <span className="response-card-title">
              <Sparkles className="text-blue-500 w-4 h-4" />
              AI Predictive Growth Insights
            </span>
            <span className="response-badge-fastapi">
              Active Risk Models
            </span>
          </div>

          <div className="response-json-box">
            {loading ? (
              <span className="text-slate-500 animate-pulse">Simulating market models via AI engine...</span>
            ) : aiResponse ? (
              <pre className="w-full text-left">{JSON.stringify(aiResponse, null, 2)}</pre>
            ) : (
              <span className="text-slate-500">Asset data empty. Query the risk engine to fetch status.</span>
            )}
          </div>
        </div>
      </div>

      {/* Simple AI Insight simulation */}
      <div className="ai-simulation-card">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="text-blue-600 w-4.5 h-4.5" />
          AI Asset Allocation Engine
        </h3>
        <p className="text-xs text-slate-500">
          Our predictive models analyze liquidity requirements, evaluate tax-loss harvesting thresholds, and simulate yield optimizations on port 8000. Under Phase 2, this risk engine will forecast returns and coordinate actions with the MERN database.
        </p>
      </div>
    </div>
  );
};

export default AiInsights;