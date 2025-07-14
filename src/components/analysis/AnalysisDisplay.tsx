import React from 'react';
import HumanizedResponse from './HumanizedResponse';
import TechnicalButton from './TechnicalButton';

interface AnalysisDisplayProps {
  results: {
    humanized_text: string;
    technicalData?: any;
    verificationCode?: string;
  };
  onOpenTechnical?: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ results, onOpenTechnical }) => {
  return (
    <div className="analysis-display">
      <div className="analysis-cards">
        <HumanizedResponse data={{ humanized_text: results.humanized_text }} />

        {results.verificationCode && (
        <div className="saphira-verification-card analysis-card">
          <div className="saphira-verification">
            <span className="verification-label">Código de Verificação:</span>
            <span className="verification-code">{results.verificationCode}</span>
          </div>
        </div>
      )}

      {/* Card de Acesso Técnico */}
      {results.technicalData && onOpenTechnical && (
        <div className="technical-access-card analysis-card">
          <h3>🔬 Análise Técnica Disponível</h3>
          <p>Acesse dados detalhados, métricas avançadas e visualizações técnicas da análise Saphira.</p>
          <button 
            className="saphira-button technical-button"
            onClick={onOpenTechnical}
          >
            🔍 Abrir Modal Técnico
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;