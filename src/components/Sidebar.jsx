import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Network, Database, Zap, MessageSquare, Scaling, CalendarCheck, Hotel } from 'lucide-react';

const navItems = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/architecture', label: 'System Architecture', icon: Network },
  { path: '/api', label: 'REST API Communication', icon: Zap },
  { path: '/database', label: 'Database Design', icon: Database },
  { path: '/caching', label: 'Caching Strategy', icon: Zap },
  { path: '/messaging', label: 'Messaging Workflow', icon: MessageSquare },
  { path: '/scalability', label: 'Scalability & Traffic', icon: Scaling },
  { path: '/simulation', label: 'Booking Simulation', icon: CalendarCheck },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Hotel className="sidebar-header-icon" size={28} />
        <h1>StayEase Studio</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
