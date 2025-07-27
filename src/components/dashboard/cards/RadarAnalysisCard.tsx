
import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';

interface RadarAnalysisCardProps {
  technicalData: any;
}

const RadarAnalysisCard: React.FC<RadarAnalysisCardProps> = ({ technicalData }) => {
  // NOVA LÓGICA DE EXTRAÇÃO - Lê o JSON real do backend
  const data = [
    { subject: 'Risco Forense', A: technicalData?.forensic_analysis?.risk_score || 0, fullMark: 100 },
    { subject: 'Carga Emocional', A: (technicalData?.forensic_analysis?.emotional_load_score || 0) * 10, fullMark: 100 },
    { subject: 'Densidade Jurídica', A: (technicalData?.legal_extraction?.densidade_juridica || 0) * 10, fullMark: 100 },
    { subject: 'Confiança Geral', A: (technicalData?.confidence_level?.score || 0) * 100, fullMark: 100 },
    { subject: 'Assertividade', A: (technicalData?.voice_calibration?.assertiveness_level || 0) * 20, fullMark: 100 },
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

export default RadarAnalysisCard;
