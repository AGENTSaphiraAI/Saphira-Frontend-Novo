
import React from 'react';

interface StatusBadgeProps {
  icon: string;
  label: string;
  value: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ icon, label, value }) => {
  return (
    <div className="status-badge">
      <span className="badge-icon">{icon}</span>
      <div className="badge-content">
        <span className="badge-label">{label}</span>
        <span className="badge-value">{value}</span>
      </div>
    </div>
  );
};

export default StatusBadge;
