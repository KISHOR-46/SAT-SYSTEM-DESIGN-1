import React from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/overview': 'Overview',
  '/architecture': 'System Architecture',
  '/api': 'REST API Communication',
  '/database': 'Database Design',
  '/caching': 'Caching Strategy',
  '/messaging': 'Messaging Workflow',
  '/scalability': 'Scalability & Traffic',
  '/simulation': 'Booking Simulation'
};

function Header() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Dashboard';

  return (
    <header className="top-header">
      <div className="header-title">{title}</div>
      <div className="header-actions">
        <span className="badge badge-info">Microservices Demo</span>
        <span className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center' }}>
          Simulated Environment
        </span>
      </div>
    </header>
  );
}

export default Header;
