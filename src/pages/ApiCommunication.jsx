import React, { useState } from 'react';
import { mockApis } from '../data/mockApis';
import { Send, Clock } from 'lucide-react';

function ApiCommunication() {
  const [selectedApi, setSelectedApi] = useState(mockApis[0]);
  const [response, setResponse] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(0);

  const sendSimulatedRequest = (apiCode) => {
    setLoading(true);
    setResponse(null);
    setStatus(null);
    
    // Simulate network delay
    const simulatedLatency = Math.floor(Math.random() * 200) + 50;
    setLatency(simulatedLatency);

    setTimeout(() => {
      setLoading(false);
      
      if (apiCode === 200 || apiCode === 201) {
        setResponse(selectedApi.exampleResponse);
        setStatus(apiCode);
      } else {
        setStatus(apiCode);
        setResponse(JSON.stringify({ error: "Simulated error response", code: apiCode }, null, 2));
      }
    }, simulatedLatency);
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'var(--info)';
      case 'POST': return 'var(--success)';
      case 'DELETE': return 'var(--error)';
      default: return 'var(--text-main)';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card">
        <h3 className="card-title">REST API Specifications</h3>
        <p className="text-muted mb-4 text-sm">Select an API from the list to view details and simulate requests.</p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Purpose</th>
                <th>Service</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockApis.map((api) => (
                <tr key={api.id} style={{ backgroundColor: selectedApi.id === api.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent' }}>
                  <td>
                    <span style={{ color: getMethodColor(api.method), fontWeight: 700 }}>{api.method}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{api.endpoint}</td>
                  <td>{api.purpose}</td>
                  <td><span className="badge badge-info">{api.service}</span></td>
                  <td>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                      onClick={() => { setSelectedApi(api); setResponse(null); setStatus(null); }}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Request Simulator</h3>
          
          <div className="mb-4">
            <div className="text-sm text-muted mb-2">Endpoint</div>
            <div className="code-panel flex items-center gap-2">
              <span style={{ color: getMethodColor(selectedApi.method), fontWeight: 700 }}>{selectedApi.method}</span>
              {selectedApi.endpoint}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-muted mb-2">Request Body / Example</div>
            <pre className="code-panel">
              {selectedApi.exampleRequest}
            </pre>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-primary" onClick={() => sendSimulatedRequest(selectedApi.method === 'POST' ? 201 : 200)} disabled={loading}>
              <Send size={16} /> Send Success Request
            </button>
            <button className="btn btn-outline" style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }} onClick={() => sendSimulatedRequest(400)} disabled={loading}>
              Simulate 400
            </button>
            <button className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => sendSimulatedRequest(500)} disabled={loading}>
              Simulate 500
            </button>
          </div>
          <p className="text-muted text-sm mt-4 italic">Note: These are mock API calls and do not contact a real backend.</p>
        </div>

        <div className="card flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="card-title mb-0">Response</h3>
            {status && (
              <div className="flex items-center gap-4">
                <span className={`badge ${status < 400 ? 'badge-success' : 'badge-error'}`}>
                  {status} {status === 200 ? 'OK' : status === 201 ? 'Created' : status === 400 ? 'Bad Request' : 'Internal Server Error'}
                </span>
                <span className="text-sm text-muted flex items-center gap-1">
                  <Clock size={14} /> {latency}ms
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1" style={{ position: 'relative' }}>
            {loading && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                Loading...
              </div>
            )}
            <pre className="code-panel" style={{ height: '100%', minHeight: '300px', margin: 0 }}>
              {response || '// Click "Send Request" to see the response'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiCommunication;
