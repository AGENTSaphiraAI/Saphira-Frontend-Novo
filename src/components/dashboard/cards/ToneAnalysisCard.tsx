import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ToneAnalysisCardProps {
  technicalData: any;
}

const ToneAnalysisCard: React.FC<ToneAnalysisCardProps> = ({ technicalData }) => {
  // NOVA LÓGICA DE EXTRAÇÃO
  const dominantTone = technicalData?.voice_calibration?.voice_mode || 'N/A';
  const emotionalTone = technicalData?.forensic_analysis?.emotional_classification || 'N/A';
  const confidence = (technicalData?.confidence_level?.score || 0) * 100;

  const getToneEmoji = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'juiza': return '⚖️';
      case 'consultora': return '🤔';
      case 'amiga': return '😊';
      default: return '😐';
    }
  };

  return (
    <div className="metric-card tone-card">
      <div className="card-header">
        <MessageSquare className="card-icon" size={20} />
        <h4>Calibração de Voz e Tom</h4>
      </div>

      <div className="card-content">
        <div className="tone-summary">
          <div className="dominant-tone">
            <span className="tone-emoji">{getToneEmoji(dominantTone)}</span>
            <div>
              <span className="tone-label">Modo de Voz</span>
              <span className="tone-value">{dominantTone}</span>
            </div>
          </div>
          <div className="confidence-score">
            <span className="confidence-label">Tom Emocional</span>
            <span className="confidence-value">{emotionalTone}</span>
          </div>
        </div>
      </div>

      <style>{`
        .tone-card .card-content {
          gap: 1.5rem;
        }

        .tone-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dominant-tone {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tone-emoji {
          font-size: 2rem;
        }

        .tone-label, .confidence-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .tone-value, .confidence-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .confidence-score {
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default ToneAnalysisCard;