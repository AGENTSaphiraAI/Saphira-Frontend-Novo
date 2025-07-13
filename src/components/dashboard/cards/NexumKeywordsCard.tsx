
import React from 'react';
import { Tag } from 'lucide-react';
import './Card.css';

interface NexumKeywordsCardProps {
  keywords: string[];
}

const NexumKeywordsCard: React.FC<NexumKeywordsCardProps> = ({ keywords }) => {
  const defaultKeywords = [
    'análise', 'texto', 'conteúdo', 'avaliação', 'documento',
    'informação', 'dados', 'processamento', 'inteligência', 'saphira'
  ];

  const displayKeywords = keywords && keywords.length > 0 ? keywords : defaultKeywords;

  const getTagColor = (index: number) => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="analysis-card keywords-card">
      <div className="card-header">
        <h3>🔗 Conceitos-Chave (NEXUM)</h3>
        <p>Palavras e conceitos identificados no texto</p>
      </div>
      
      <div className="card-content">
        <div className="keywords-container">
          {displayKeywords.slice(0, 15).map((keyword, index) => (
            <div
              key={index}
              className="keyword-pill"
              style={{
                backgroundColor: getTagColor(index),
                '--hover-color': getTagColor(index)
              } as React.CSSProperties}
            >
              <Tag size={14} />
              <span>{keyword}</span>
            </div>
          ))}
        </div>

        <div className="keywords-stats">
          <div className="stat">
            <span className="stat-number">{displayKeywords.length}</span>
            <span className="stat-label">Total de Conceitos</span>
          </div>
          <div className="stat">
            <span className="stat-number">{Math.min(15, displayKeywords.length)}</span>
            <span className="stat-label">Exibidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NexumKeywordsCard;
