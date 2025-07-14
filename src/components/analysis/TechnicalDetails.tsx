
import React from 'react';
import Badge from './Badge';

interface TechnicalDetailsProps {
  data: {
    tom: { tipo: string; confianca: number };
    vies: { detectado: boolean; confianca: number };
    contradicoes: { detectada: boolean; confianca: number };
    sugestao: string;
  };
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ data }) => {
  return (
    <div className="card technical-card">
      <h4>📄 Dados Técnicos</h4>
      <Badge icon="🎭" label={`Tom: ${data.tom.tipo} (${Math.round(data.tom.confianca * 100)}%)`} category="tom" />
      <Badge icon="⚖️" label={`Viés: ${data.vies.detectado ? 'Detectado' : 'Não detectado'} (${Math.round(data.vies.confianca * 100)}%)`} category="vies" />
      <Badge icon="❗" label={`Contradições: ${data.contradicoes.detectada ? 'Sim' : 'Não'} (${Math.round(data.contradicoes.confianca * 100)}%)`} category="contradicao" />
      <p>💡 <strong>Sugestão:</strong> {data.sugestao}</p>
    </div>
  );
};

export default TechnicalDetails;
