import React from 'react';

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
        <div className="analysis-message">
          <p>⚠️ Este componente foi substituído pelo AnalysisDashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;