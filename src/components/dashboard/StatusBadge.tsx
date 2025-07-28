import React from 'react';

interface StatusBadgeProps {
  icon: string;
  label: string;
  value: string;
  tooltip?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ icon, label, value, tooltip }) => {
  return (
    <motion.div 
      className="status-badge"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      title={tooltip}
    >
      <div className="badge-content">
        <span className="badge-icon">{icon}</span>
        <div className="badge-info">
          <span className="badge-label">{label}</span>
          <span className="badge-value">{value}</span>
        </div>
      </div>

      <style jsx>{`
        .status-badge {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .status-badge:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .badge-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .badge-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .badge-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.25rem;
        }

        .badge-value {
          font-size: 1.1rem;
          font-weight: bold;
          color: #fff;
        }

        @media (max-width: 768px) {
          .status-badge {
            padding: 0.75rem;
          }

          .badge-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .badge-info {
            align-items: center;
            text-align: center;
          }

          .badge-icon {
            font-size: 1.8rem;
          }

          .badge-label {
            font-size: 0.8rem;
          }

          .badge-value {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .status-badge {
            padding: 0.6rem;
          }

          .badge-icon {
            font-size: 1.5rem;
          }

          .badge-label {
            font-size: 0.75rem;
          }

          .badge-value {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default StatusBadge;