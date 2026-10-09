import React, { useState } from 'react';
import { generateMockMetrics, generateTrafficData } from '../data/mockMetrics';
import { Scaling, Database, Layers, Lock, Shield, Server, Activity, Monitor } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Scalability() {
  const [trafficLevel, setTrafficLevel] = useState('normal');
  const metrics = generateMockMetrics(trafficLevel);
  const trafficData = generateTrafficData(30).map(d => ({
    ...d,
    requests: trafficLevel === 'peak' ? d.requests * 5 : trafficLevel === 'low' ? d.requests * 0.2 : d.requests
  }));

  const strategies = [
    {
      title: "Load Balancing",
      icon: Layers,
      desc: "Distributes incoming HTTP requests evenly across multiple application instances to prevent any single server from becoming a bottleneck."
    },
    {
      title: "Horizontal Scaling",
      icon: Server,
      desc: "Automatically spins up new containers (e.g., Kubernetes Pods) for the Booking and Hotel Search services as CPU/Memory utilization rises."
    },
    {
      title: "Database Optimization",
      icon: Database,
      desc: "Implements connection pooling (PgBouncer), read replicas for hotel searches, and proper indexing on frequently queried columns (user_id, hotel_id)."
    },
    {
      title: "Concurrency Control",
      icon: Lock,
      desc: "Uses database transactions and row-level locking (SELECT FOR UPDATE) to prevent double booking when two users try to book the last room simultaneously."
    },
    {
      title: "Idempotency",
      icon: Shield,
      desc: "API endpoints accept an Idempotency-Key header to prevent duplicate bookings or payments if the client retries a request after a network timeout."
    },
    {
      title: "Temporary Inventory Holds",
      icon: Activity,
      desc: "When a user begins checkout, the room is placed on a temporary hold (e.g. 10 minutes) in Redis. If payment fails or expires, the hold is released automatically."
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Scalability & Peak-Traffic Handling</h2>
          <p className="text-muted text-sm">Strategies to maintain performance at scale</p>
        </div>
        <div className="flex gap-2 bg-white rounded-lg p-1 border border-slate-200">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${trafficLevel === 'low' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTrafficLevel('low')}
          >
            Low Traffic
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${trafficLevel === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTrafficLevel('normal')}
          >
            Normal Traffic
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${trafficLevel === 'peak' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => setTrafficLevel('peak')}
          >
            Peak Traffic
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4">
        <div className="card text-center p-4">
          <div className="text-sm text-slate-500">Simulated RPS</div>
          <div className={`text-2xl font-bold mt-1 ${trafficLevel === 'peak' ? 'text-red-600' : 'text-blue-600'}`}>{metrics.rps}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-sm text-slate-500">Active Instances</div>
          <div className="text-2xl font-bold mt-1 text-slate-700">{trafficLevel === 'peak' ? '42' : trafficLevel === 'normal' ? '12' : '3'}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-sm text-slate-500">DB CPU Load</div>
          <div className={`text-2xl font-bold mt-1 ${trafficLevel === 'peak' ? 'text-amber-600' : 'text-green-600'}`}>{trafficLevel === 'peak' ? '87%' : trafficLevel === 'normal' ? '45%' : '12%'}</div>
        </div>
        <div className="card text-center p-4">
          <div className="text-sm text-slate-500">Message Queue Delay</div>
          <div className="text-2xl font-bold mt-1 text-slate-700">{trafficLevel === 'peak' ? '125ms' : '15ms'}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title flex items-center gap-2">
          <Monitor size={18} /> System Monitoring
        </h3>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="requests" 
                stroke={trafficLevel === 'peak' ? '#ef4444' : trafficLevel === 'low' ? '#10b981' : '#2563eb'} 
                strokeWidth={3} 
                dot={false} 
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {trafficLevel === 'peak' && (
          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded border border-amber-200 text-sm flex gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              <strong>Peak Traffic Detected:</strong> The system has automatically scaled up to 42 service instances. Caching is absorbing 92% of read requests. Write requests for bookings are being queued and processed asynchronously to prevent database connection exhaustion.
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {strategies.map((strategy, idx) => {
          const Icon = strategy.icon;
          return (
            <div key={idx} className="card p-5 hover:border-blue-300 transition-colors cursor-default" style={{ margin: 0 }}>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg text-blue-600">
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">{strategy.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{strategy.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Scalability;
