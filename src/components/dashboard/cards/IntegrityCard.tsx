
import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface IntegrityCardProps {
  technicalData: any;
}

const IntegrityCard: React.FC<IntegrityCardProps> = ({ technicalData }) => {
  // NOVA LÓGICA DE EXTRAÇÃO
  const riskLevel = technicalData?.forensic_analysis?.overall_manipulation_risk || 'Indefinido';
  const riskScore = technicalData?.forensic_analysis?.risk_score || 0;
  const sources = technicalData?.forensic_analysis?.source_attribution_quality || 'N/A';

  const getRiskColor = () => {
    if (riskLevel.toLowerCase().includes('baixo')) return '#10b981';
    if (riskLevel.toLowerCase().includes('moderado')) return '#f59e0b';
    return '#ef4444';
  }

  return (
    <div className="metric-card integrity-card">
      <div className="card-header">
        <Shield className="card-icon" size={20} />
        <h4>Integridade e Risco</h4>
      </div>

      <div className="card-content">
        <div className="integrity-score">
          <div className="score-circle" style={{ background: `linear-gradient(135deg, ${getRiskColor()} 0%, ${getRiskColor()}cc 100%)` }}>
            <span className="score-value">{riskScore.toFixed(0)}%</span>
            <span className="score-label">Risco</span>
          </div>
        </div>

        <div className="integrity-details">
          <div className="detail-item">
            {riskLevel.toLowerCase().includes('baixo') ? (
              <CheckCircle className="detail-icon success" size={16} />
            ) : (
              <AlertTriangle className="detail-icon warning" size={16} />
            )}
            <div className="detail-content">
              <span className="detail-label">Nível de Risco</span>
              <span className="detail-value" style={{color: getRiskColor()}}>{riskLevel}</span>
            </div>
          </div>

          <div className="detail-item">
            <CheckCircle className="detail-icon success" size={16} />
            <div className="detail-content">
              <span className="detail-label">Qualidade das Fontes</span>
              <span className="detail-value">{sources}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
