
import React from 'react';
import { Hash } from 'lucide-react';

interface NexumKeywordsCardProps {
  technicalData: any;
}

const NexumKeywordsCard: React.FC<NexumKeywordsCardProps> = ({ technicalData }) => {
  const getKeywords = () => {
    // Mock keywords based on technical data or generate random ones
    const mockKeywords = [
      { word: 'análise', relevance: 95 },
      { word: 'conteúdo', relevance: 87 },
      { word: 'técnico', relevance: 78 },
      { word: 'dados', relevance: 72 },
      { word: 'interpretação', relevance: 68 },
      { word: 'contextual', relevance: 65 }
    ];

    // If we have actual keywords from technical data, use them
    if (technicalData?.keywords) {
      return technicalData.keywords.slice(0, 6);
    }

    return mockKeywords;
  };

  const keywords = getKeywords();
  const totalRelevance = keywords.reduce((sum: number, kw: any) => sum + kw.relevance, 0);
  const avgRelevance = totalRelevance / keywords.length;

  return (
    <div className="metric-card keywords-card">
      <div className="card-header">
        <Hash className="card-icon" size={20} />
        <h4>Palavras-Chave Nexum</h4>
      </div>
      
      <div className="card-content">
        <div className="keywords-summary">
          <div className="summary-item">
            <TrendingUp className="summary-icon" size={16} />
            <div>
              <span className="summary-label">Relevância Média</span>
              <span className="summary-value">{avgRelevance.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="keywords-list">
          {keywords.map((keyword: any, index: number) => (
            <div key={index} className="keyword-item">
              <span className="keyword-text">{keyword.word}</span>
              <div className="keyword-bar">
                <div 
                  className="keyword-fill"
                  style={{ width: `${keyword.relevance}%` }}
                ></div>
              </div>
              <span className="keyword-score">{keyword.relevance}%</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .keywords-card .card-content {
          gap: 1.5rem;
        }

        .keywords-summary {
          display: flex;
          justify-content: center;
        }

        .summary-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .summary-icon {
          color: #0b74e5;
        }

        .summary-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .summary-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .keywords-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .keyword-item {
          display: grid;
          grid-template-columns: 1fr 2fr auto;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .keyword-text {
          font-weight: 500;
          color: #1e293b;
        }

        .keyword-bar {
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .keyword-fill {
          height: 100%;
          background: linear-gradient(90deg, #0b74e5, #1d4ed8);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .keyword-score {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default NexumKeywordsCard;
