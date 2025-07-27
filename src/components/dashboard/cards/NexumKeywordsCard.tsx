
import React from 'react';
import { Hash } from 'lucide-react';

interface NexumKeywordsCardProps {
  technicalData: any;
}

const NexumKeywordsCard: React.FC<NexumKeywordsCardProps> = ({ technicalData }) => {
  // NOVA LÓGICA DE EXTRAÇÃO
  const keywords = technicalData?.keywords || [];

  return (
    <div className="metric-card keywords-card">
      <div className="card-header">
        <Hash className="card-icon" size={20} />
        <h4>Conceitos-Chave (NEXUM)</h4>
      </div>

      <div className="card-content">
        <div className="keywords-list-tags">
          {keywords.length > 0 ? keywords.map((keyword: string, index: number) => (
            <span key={index} className="keyword-tag">{keyword}</span>
          )) : <p>Nenhum conceito-chave extraído.</p>}
        </div>
      </div>

      <style>{`
        .keywords-card .card-content {
          gap: 1.5rem;
        }

        .keywords-list-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .keyword-tag {
          background-color: #e8eaf6;
          color: #3f51b5;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .keyword-tag:hover {
          background-color: #3f51b5;
          color: white;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default NexumKeywordsCard;
