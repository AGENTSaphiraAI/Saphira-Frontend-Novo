
import React from 'react';
import HumanizedResponse from './HumanizedResponse';
import TechnicalButton from './TechnicalButton';

interface AnalysisDisplayProps {
  results: {
    humanized_text: string;
    technicalData?: any;
    verificationCode?: string;
  };
  onOpenTechnical: () => void;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ results, onOpenTechnical }) => {
  return (
    <div className="analysis-display">
      <div className="analysis-cards">
        <HumanizedResponse data={{ humanized_text: results.humanized_text }} />
        
        {results.verificationCode && (
          <div className="saphira-verification-card">
            <span className="verification-label">🔐 Código de verificação:</span>
            <code className="verification-code">{results.verificationCode}</code>
          </div>
        )}
        
        {results.technicalData && (
          <TechnicalButton onClick={onOpenTechnical} />
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
