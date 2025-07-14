
import React from 'react';

interface TechnicalButtonProps {
  onClick: () => void;
}

const TechnicalButton: React.FC<TechnicalButtonProps> = ({ onClick }) => {
  return (
    <div className="technical-access-card analysis-card">
      <h4>🔬 Análise Técnica Disponível</h4>
      <p>Dados técnicos, métricas e visualizações detalhadas</p>
      <button 
        className="saphira-button technical-button"
        onClick={onClick}
      >
        📊 Ver Análise Detalhada
      </button>
    </div>
  );
};

export default TechnicalButton;
