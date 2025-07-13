
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import './Card.css';

interface ToneAnalysisCardProps {
  data: any;
}

const ToneAnalysisCard: React.FC<ToneAnalysisCardProps> = ({ data }) => {
  const getToneInfo = () => {
    if (!data?.tom) {
      return {
        type: 'neutro',
        confidence: 0.75,
        icon: <Meh size={48} />,
        color: '#64748b',
        bgColor: '#f1f5f9',
        label: 'Neutro'
      };
    }

    const toneType = data.tom.tipo?.toLowerCase() || 'neutro';
    const confidence = data.tom.confianca || 0;

    const toneMap: Record<string, any> = {
      positivo: {
        icon: <Smile size={48} />,
        color: '#10b981',
        bgColor: '#ecfdf5',
        label: 'Positivo'
      },
      negativo: {
        icon: <Frown size={48} />,
        color: '#ef4444',
        bgColor: '#fef2f2',
        label: 'Negativo'
      },
      neutro: {
        icon: <Meh size={48} />,
        color: '#64748b',
        bgColor: '#f1f5f9',
        label: 'Neutro'
      }
    };

    return {
      type: toneType,
      confidence,
      ...toneMap[toneType] || toneMap.neutro
    };
  };

  const toneInfo = getToneInfo();

  return (
    <div 
      className="analysis-card tone-card"
      style={{ backgroundColor: toneInfo.bgColor }}
    >
      <div className="card-header">
        <h3>🎭 Análise de Tom</h3>
        <p>Avaliação do sentimento do texto</p>
      </div>
      
      <div className="card-content">
        <div className="tone-display">
          <div 
            className="tone-icon"
            style={{ color: toneInfo.color }}
          >
            {toneInfo.icon}
          </div>
          
          <div className="tone-info">
            <h4 style={{ color: toneInfo.color }}>
              {toneInfo.label}
            </h4>
            <div className="confidence-bar">
              <div className="confidence-label">
                Confiança: {Math.round(toneInfo.confidence * 100)}%
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${toneInfo.confidence * 100}%`,
                    backgroundColor: toneInfo.color
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToneAnalysisCard;
