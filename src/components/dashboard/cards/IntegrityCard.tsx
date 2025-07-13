
import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import './Card.css';

interface IntegrityCardProps {
  data: any;
}

const IntegrityCard: React.FC<IntegrityCardProps> = ({ data }) => {
  const calculateMetrics = () => {
    const defaultMetrics = {
      coherence: 0.8,
      clarity: 0.75,
      consistency: 0.85
    };

    if (!data) return defaultMetrics;

    const metrics: any = {};

    // Mapear dados técnicos para métricas de integridade
    if (data.tom?.confianca) {
      metrics.clarity = data.tom.confianca;
    }
    
    if (data.vies?.confianca) {
      metrics.coherence = data.vies.confianca;
    }
    
    if (data.contradicoes?.confianca) {
      metrics.consistency = data.contradicoes.confianca;
    }

    return { ...defaultMetrics, ...metrics };
  };

  const metrics = calculateMetrics();
  const overallScore = (metrics.coherence + metrics.clarity + metrics.consistency) / 3;

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return '#10b981';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle size={20} />;
    if (score >= 0.6) return <AlertTriangle size={20} />;
    return <Shield size={20} />;
  };

  const MetricRing: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${value * circumference} ${circumference}`;

    return (
      <div className="metric-ring">
        <svg width="100" height="100" className="ring-svg">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.5s ease-in-out'
            }}
          />
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dy="0.3em"
            fontSize="16"
            fontWeight="bold"
            fill={color}
          >
            {Math.round(value * 100)}%
          </text>
        </svg>
        <p className="metric-label">{label}</p>
      </div>
    );
  };

  return (
    <div className="analysis-card integrity-card">
      <div className="card-header">
        <h3>🛡️ Integridade do Documento</h3>
        <p>Métricas de qualidade e confiabilidade</p>
      </div>
      
      <div className="card-content">
        <div className="overall-score">
          <div 
            className="score-badge"
            style={{ 
              color: getScoreColor(overallScore),
              borderColor: getScoreColor(overallScore)
            }}
          >
            {getScoreIcon(overallScore)}
            <span>Score Geral: {Math.round(overallScore * 100)}%</span>
          </div>
        </div>

        <div className="metrics-rings">
          <MetricRing 
            value={metrics.coherence} 
            label="Coerência Lógica" 
            color={getScoreColor(metrics.coherence)}
          />
          <MetricRing 
            value={metrics.clarity} 
            label="Clareza" 
            color={getScoreColor(metrics.clarity)}
          />
          <MetricRing 
            value={metrics.consistency} 
            label="Consistência" 
            color={getScoreColor(metrics.consistency)}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrityCard;
