
import React from 'react';

interface HumanizedResponseProps {
  data: {
    humanized_text: string;
    resposta_geral?: string;
  };
}

const HumanizedResponse: React.FC<HumanizedResponseProps> = ({ data }) => {
  return (
    <div className="saphira-response-card analysis-card">
      <h3>💬 Saphira diz:</h3>
      <p>{data.humanized_text}</p>
      {data.resposta_geral && <p><strong>{data.resposta_geral}</strong></p>}
    </div>
  );
};

export default HumanizedResponse;se;
