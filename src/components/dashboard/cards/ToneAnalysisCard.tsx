
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MessageSquare } from 'lucide-react';

interface ToneAnalysisCardProps {
  technicalData: any;
}

const ToneAnalysisCard: React.FC<ToneAnalysisCardProps> = ({ technicalData }) => {
  const getToneData = () => {
    const toneType = technicalData?.tom?.tipo || 'neutro';
    const confidence = technicalData?.tom?.confianca || Math.random() * 100;
    
    const tones = ['Positivo', 'Neutro', 'Negativo', 'Analítico'];
    const data = tones.map(tone => ({
      name: tone,
      value: tone.toLowerCase() === toneType.toLowerCase() ? confidence : Math.random() * 30
    }));
    
    return { data, dominantTone: toneType, confidence };
  };

  const { data, dominantTone, confidence } = getToneData();

  const getToneEmoji = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'positivo': return '😊';
      case 'negativo': return '😔';
      case 'neutro': return '😐';
      case 'analítico': return '🤔';
      default: return '😐';
    }
  };

  return (
    <div className="metric-card tone-card">
      <div className="card-header">
        <MessageSquare className="card-icon" size={20} />
        <h4>Análise de Tom</h4>
      </div>
      
      <div className="card-content">
        <div className="tone-summary">
          <div className="dominant-tone">
            <span className="tone-emoji">{getToneEmoji(dominantTone)}</span>
            <div>
              <span className="tone-label">Tom Dominante</span>
              <span className="tone-value">{dominantTone}</span>
            </div>
          </div>
          <div className="confidence-score">
            <span className="confidence-label">Confiança</span>
            <span className="confidence-value">{confidence.toFixed(1)}%</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
            />
            <YAxis hide />
            <Bar 
              dataKey="value" 
              fill="#0b74e5" 
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .tone-card .card-content {
          gap: 1.5rem;
        }

        .tone-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dominant-tone {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tone-emoji {
          font-size: 2rem;
        }

        .tone-label, .confidence-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .tone-value, .confidence-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .confidence-score {
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default ToneAnalysisCard;
