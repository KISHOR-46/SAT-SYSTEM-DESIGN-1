import React from 'react';

function MetricCard({ title, value, icon: Icon, unit = '' }) {
  return (
    <div className="card metric-card">
      <div className="metric-info">
        <div className="metric-label">{title}</div>
        <div className="metric-value">
          {value}
          {unit && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{unit}</span>}
        </div>
      </div>
      {Icon && (
        <div className="metric-icon">
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}

export default MetricCard;
