import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import { generateMockMetrics, generateTrafficData } from '../data/mockMetrics';
import { Activity, Users, Clock, CheckCircle, Zap, Server, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

function Overview() {
  const [metrics, setMetrics] = useState(generateMockMetrics('normal'));
  const [trafficData, setTrafficData] = useState(generateTrafficData());
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setMetrics(generateMockMetrics('peak'));
    setTrafficData(generateTrafficData());
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  const bookingData = [
    { name: 'Success', value: metrics.successRate },
    { name: 'Failure', value: 100 - metrics.successRate }
  ];

  const cacheData = [
    { name: 'Hit', value: metrics.cacheHitRatio },
    { name: 'Miss', value: 100 - metrics.cacheHitRatio }
  ];

  const serviceDistribution = [
    { name: 'Hotel Search', requests: 45 },
    { name: 'Inventory', requests: 30 },
    { name: 'Booking', requests: 15 },
    { name: 'Payment', requests: 10 },
  ];

  const COLORS = ['#10b981', '#ef4444'];
  const CACHE_COLORS = ['#3b82f6', '#f59e0b'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-main" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Online Hotel Booking Platform</h2>
          <p className="text-muted">Microservices Architecture • Target Scale: Millions of users</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={runSimulation}
          disabled={isSimulating}
        >
          <Play size={18} />
          {isSimulating ? 'Running...' : 'Run Demo Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-3 mb-6">
        <MetricCard title="Requests Per Second" value={metrics.rps} icon={Activity} />
        <MetricCard title="Active Users" value={(metrics.activeUsers / 1000).toFixed(1)} unit="k" icon={Users} />
        <MetricCard title="Avg Response Time" value={metrics.responseTime} unit="ms" icon={Clock} />
        <MetricCard title="Booking Success" value={metrics.successRate} unit="%" icon={CheckCircle} />
        <MetricCard title="Cache Hit Ratio" value={metrics.cacheHitRatio} unit="%" icon={Zap} />
        <MetricCard title="Queue Length" value={metrics.queueLength} icon={Server} />
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="card-title">Simulated Traffic Over Time</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Service Request Distribution</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceDistribution} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="requests" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Booking Success vs Failure</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={bookingData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {bookingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Cache Hit vs Miss</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cacheData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {cacheData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CACHE_COLORS[index % CACHE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;
