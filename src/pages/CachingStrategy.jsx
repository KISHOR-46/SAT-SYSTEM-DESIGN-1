import React, { useState } from 'react';
import { Database, Zap, ArrowRight, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';

function CachingStrategy() {
  const [cacheState, setCacheState] = useState({
    hitCount: 1520,
    missCount: 215,
    dbQueries: 215,
    isCached: true
  });
  
  const [activeStep, setActiveStep] = useState(null);
  const [simulationLog, setSimulationLog] = useState([]);

  const simulateRequest = () => {
    setActiveStep(1); // API Gateway
    
    setTimeout(() => {
      setActiveStep(2); // Cache Lookup
      
      setTimeout(() => {
        if (cacheState.isCached) {
          setActiveStep(3); // Cache Hit
          setCacheState(prev => ({ ...prev, hitCount: prev.hitCount + 1 }));
          addLog("Cache HIT! Returned hotel details in 5ms.");
          setTimeout(() => setActiveStep(null), 1000);
        } else {
          setActiveStep(4); // Cache Miss
          addLog("Cache MISS! Querying Database...");
          
          setTimeout(() => {
            setActiveStep(5); // DB Query
            setCacheState(prev => ({ 
              ...prev, 
              missCount: prev.missCount + 1,
              dbQueries: prev.dbQueries + 1,
              isCached: true // Cache populated
            }));
            addLog("Database queried (250ms). Data stored in cache.");
            
            setTimeout(() => {
              setActiveStep(6); // Return
              setTimeout(() => setActiveStep(null), 1000);
            }, 800);
          }, 800);
        }
      }, 800);
    }, 800);
  };

  const addLog = (msg) => {
    setSimulationLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const clearCache = () => {
    setCacheState(prev => ({ ...prev, isCached: false }));
    addLog("Cache Cleared manually via admin action.");
  };

  const totalReqs = cacheState.hitCount + cacheState.missCount;
  const hitRatio = totalReqs > 0 ? ((cacheState.hitCount / totalReqs) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Redis Caching Strategy</h2>
          <p className="text-muted text-sm">Reducing Database Load with In-Memory Caching</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={clearCache}>
            <XCircle size={16} /> Clear Cache
          </button>
          <button className="btn btn-primary" onClick={simulateRequest} disabled={activeStep !== null}>
            <Zap size={16} /> Simulate Client Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="card text-center">
          <div className="text-muted text-sm mb-1">Cache Hit Ratio</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>{hitRatio}%</div>
        </div>
        <div className="card text-center">
          <div className="text-muted text-sm mb-1">Database Queries Saved</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--success)' }}>{cacheState.hitCount}</div>
        </div>
        <div className="card text-center">
          <div className="text-muted text-sm mb-1">Actual DB Queries</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--error)' }}>{cacheState.dbQueries}</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Read-Through Cache Flow</h3>
          <div className="flex flex-col items-center py-6 gap-4">
            <div className={`p-3 rounded border-2 w-48 text-center transition-all ${activeStep === 1 ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200'}`}>
              Client Request
            </div>
            
            <ArrowRight size={24} className="text-slate-400 transform rotate-90" />
            
            <div className={`p-3 rounded border-2 w-48 text-center transition-all flex items-center justify-center gap-2 ${activeStep === 2 ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-200'}`}>
              <Zap size={18} /> Cache Lookup
            </div>
            
            <div className="flex w-full justify-center gap-16 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-sm text-green-600 font-semibold mb-2">HIT</span>
                <div className={`p-3 rounded border-2 w-32 text-center transition-all ${activeStep === 3 ? 'border-green-500 bg-green-50 shadow-md' : 'border-slate-200'}`}>
                  Return Data
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-sm text-red-600 font-semibold mb-2">MISS</span>
                <div className={`p-3 rounded border-2 w-32 text-center transition-all flex flex-col items-center gap-1 ${activeStep === 5 ? 'border-red-500 bg-red-50 shadow-md' : 'border-slate-200'}`}>
                  <Database size={16} /> Query DB
                </div>
                <ArrowRight size={16} className="text-slate-400 transform rotate-90 my-2" />
                <div className={`p-3 rounded border-2 w-32 text-center text-xs transition-all ${activeStep === 6 ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-slate-200'}`}>
                  Store in Cache
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card flex-1">
            <h3 className="card-title">Simulation Log</h3>
            <div className="bg-slate-900 rounded p-4 h-48 overflow-y-auto text-slate-300 font-mono text-sm" style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}>
              {simulationLog.length === 0 ? (
                <div className="text-slate-500 text-center mt-12">Click "Simulate Client Request" to start.</div>
              ) : (
                simulationLog.map((log, i) => <div key={i} className="mb-2">{log}</div>)
              )}
            </div>
          </div>

          <div className="card border-l-4 border-amber-500" style={{ borderLeftColor: 'var(--warning)', borderLeftWidth: '4px' }}>
            <h4 className="font-semibold flex items-center gap-2 mb-2 text-amber-700" style={{ color: '#b45309' }}>
              <AlertTriangle size={18} /> Critical Architecture Rule
            </h4>
            <p className="text-sm text-slate-700">
              Never use stale cached availability as the final authority for confirming a reservation. 
              Always verify and reserve room inventory atomically in the authoritative database (PostgreSQL) using row-level locking or transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CachingStrategy;
