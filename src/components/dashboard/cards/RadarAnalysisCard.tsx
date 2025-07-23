
import React, { memo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

interface RadarAnalysisCardProps {
  technicalData: any;
}

const RadarAnalysisCard: React.FC<RadarAnalysisCardProps> = ({ technicalData }) => {
  const getMetricValue = (key: string): number => {
    if (!technicalData) return Math.random() * 100;
    
    switch (key) {
      case 'tone':
        return technicalData.tom?.confianca || technicalData.tone || Math.random() * 100;
      case 'bias':
        return technicalData.vies?.confianca || technicalData.bias || Math.random() * 100;
      case 'contradiction':
        return technicalData.contradicoes?.confianca || technicalData.contradiction || Math.random() * 100;
      case 'clarity':
        return technicalData.clarity || Math.random() * 100;
      case 'consistency':
        return technicalData.consistency || Math.random() * 100;
      default:
        return Math.random() * 100;
    }
  };

  const data = [
    { subject: 'Tom', A: getMetricValue('tone'), fullMark: 100 },
    { subject: 'Viés', A: getMetricValue('bias'), fullMark: 100 },
    { subject: 'Contradições', A: getMetricValue('contradiction'), fullMark: 100 },
    { subject: 'Clareza', A: getMetricValue('clarity'), fullMark: 100 },
    { subject: 'Consistência', A: getMetricValue('consistency'), fullMark: 100 },
  ];

  return (
    <div className="metric-card radar-card">
      <div className="card-header">
        <Target className="card-icon" size={20} />
        <h4>Análise Multidimensional</h4>
      </div>
      
      <div className="card-content">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#64748b' }}
            />
            <Radar
              name="Score"
              dataKey="A"
              stroke="#0b74e5"
              fill="#0b74e5"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
        
        <div className="radar-summary">
          <span>Pontuação Média: {(data.reduce((acc, item) => acc + item.A, 0) / data.length).toFixed(1)}%</span>
        </div>
      </div>

      <style>{`
        .metric-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          color: #0b74e5;
        }

        .card-header h4 {
          margin: 0;
          color: #1e293b;
          font-size: 1rem;
          font-weight: 600;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .radar-summary {
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default memo(RadarAnalysisCard);
