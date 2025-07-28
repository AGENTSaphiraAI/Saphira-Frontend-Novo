
import React from 'react';

interface StatusBadgeProps {
  icon: string;
  label: string;
  value: string;
  tooltip?: string; // Adicionamos uma prop opcional para o tooltip
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ icon, label, value, tooltip }) => {
  return (
    <div className="status-badge-wrapper">
      <div className="status-badge">
        <span className="badge-icon">{icon}</span>
        <div className="badge-content">
          <span className="badge-label">{label}</span>
          <span className="badge-value">{value}</span>
        </div>
      </div>
      {/* O tooltip só aparece se a prop for fornecida */}
      {tooltip && <div className="tooltip">{tooltip}</div>}
      
      {/* Estilos foram movidos para dentro do componente para simplicidade */}
      <style>{`
        .status-badge-wrapper {
          position: relative; /* Essencial para o posicionamento do tooltip */
          display: inline-block;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .badge-icon { font-size: 1.25rem; }
        .badge-label { display: block; font-size: 0.75rem; color: #64748b; }
        .badge-value { display: block; font-weight: 600; color: #1e293b; }

        /* Estilo e lógica do Tooltip */
        .tooltip {
          visibility: hidden;
          width: 220px;
          background-color: #334155;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Posiciona acima do badge */
          left: 50%;
          margin-left: -110px; /* Metade da largura para centralizar */
          opacity: 0;
          transition: opacity 0.3s;
          font-size: 0.8rem;
        }

        .tooltip::after { /* A "setinha" do tooltip */
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #334155 transparent transparent transparent;
        }

        .status-badge-wrapper:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default StatusBadge;
