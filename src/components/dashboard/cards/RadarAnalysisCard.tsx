
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import './Card.css';

interface RadarAnalysisCardProps {
  data: any;
}

import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface RadarAnalysisCardProps {
  data?: any;
}

const RadarAnalysisCard: React.FC<RadarAnalysisCardProps> = ({ data }) => {
  const transformDataForRadar = () => {
    const defaultData = [
      { subject: 'Tom', A: 75, fullMark: 100 },
      { subject: 'Clareza', A: 80, fullMark: 100 },
      { subject: 'Coerência', A: 85, fullMark: 100 },
      { subject: 'Objetividade', A: 70, fullMark: 100 },
      { subject: 'Consistência', A: 90, fullMark: 100 }
    ];

    if (!data) return defaultData;

    const radarData = [];
    
    if (data.tom?.confianca) {
      radarData.push({ 
        subject: 'Tom', 
        A: Math.round(data.tom.confianca * 100), 
        fullMark: 100 
      });
    }
    
    if (data.vies?.confianca) {
      radarData.push({ 
        subject: 'Imparcialidade', 
        A: Math.round(data.vies.confianca * 100), 
        fullMark: 100 
      });
    }
    
    if (data.contradicoes?.confianca) {
      radarData.push({ 
        subject: 'Consistência', 
        A: Math.round(data.contradicoes.confianca * 100), 
        fullMark: 100 
      });
    }

    return radarData.length > 0 ? radarData : defaultData;
  };

  const radarData = transformDataForRadar();

  return (
    <div className="analysis-card">
      <div className="card-header">
        <h3>📈 Análise de Radar</h3>
        <p>Métricas de qualidade da análise</p>
      </div>
      
      <div className="card-content">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis 
              angle={0} 
              domain={[0, 100]}
              tick={false}
            />
            <Radar
              name="Saphira"
              dataKey="A"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarAnalysisCard;
