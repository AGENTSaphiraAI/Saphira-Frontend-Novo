
import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface IntegrityCardProps {
  technicalData: any;
}

const IntegrityCard: React.FC<IntegrityCardProps> = ({ technicalData }) => {
  const getBiasInfo = () => {
    const detected = technicalData?.vies?.detectado || false;
    const confidence = technicalData?.vies?.confianca || Math.random() * 100;
    return { detected, confidence };
  };

  const getContradictionInfo = () => {
    const detected = technicalData?.contradicoes?.detectada || false;
    const confidence = technicalData?.contradicoes?.confianca || Math.random() * 100;
    return { detected, confidence };
  };

  const bias = getBiasInfo();
  const contradiction = getContradictionInfo();
  
  const integrityScore = ((bias.detected ? 0 : 100) + (contradiction.detected ? 0 : 100)) / 2;

  return (
    <div className="metric-card integrity-card">
      <div className="card-header">
        <Shield className="card-icon" size={20} />
        <h4>Integridade do Conteúdo</h4>
      </div>
      
      <div className="card-content">
        <div className="integrity-score">
          <div className="score-circle">
            <span className="score-value">{integrityScore.toFixed(0)}%</span>
            <span className="score-label">Integridade</span>
          </div>
        </div>

        <div className="integrity-details">
          <div className="detail-item">
            {bias.detected ? (
              <AlertTriangle className="detail-icon warning" size={16} />
            ) : (
              <CheckCircle className="detail-icon success" size={16} />
            )}
            <div className="detail-content">
              <span className="detail-label">Viés Detectado</span>
              <span className="detail-value">
                {bias.detected ? `Sim (${bias.confidence.toFixed(1)}%)` : 'Não detectado'}
              </span>
            </div>
          </div>

          <div className="detail-item">
            {contradiction.detected ? (
              <AlertTriangle className="detail-icon warning" size={16} />
            ) : (
              <CheckCircle className="detail-icon success" size={16} />
            )}
            <div className="detail-content">
              <span className="detail-label">Contradições</span>
              <span className="detail-value">
                {contradiction.detected ? `Detectadas (${contradiction.confidence.toFixed(1)}%)` : 'Não detectadas'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .integrity-card .card-content {
          gap: 1.5rem;
        }

        .integrity-score {
          display: flex;
          justify-content: center;
        }

        .score-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .score-value {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .score-label {
          font-size: 0.7rem;
          opacity: 0.9;
        }

        .integrity-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .detail-icon.success {
          color: #10b981;
        }

        .detail-icon.warning {
          color: #f59e0b;
        }

        .detail-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default IntegrityCard;
