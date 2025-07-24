
import React from 'react';
import { SolutionSectionProps } from '../types';

const SolutionSection: React.FC<SolutionSectionProps> = ({
  title = "A Solução Saphira",
  solutions = [
    "**Constituição de 21 Leis** que garante análises auditáveis e neutras",
    "**Expertise jurídica inicial** com capacidade de expansão para outros nichos",
    "**Transparência total** em todos os processos analíticos",
    "**Metodologia de criação ágil** com parceria Humano-IA"
  ]
}) => {
  return (
    <section className="marketing-solution">
      <h2 className="section-title">{title}</h2>
      <div className="solutions-container">
        <div className="solution-highlight">
          <h3>Uma IA, Múltiplas Especialidades</h3>
          <p>A essência da Saphira é sua **Constituição de 21 Leis**, que garante que toda análise seja auditável, neutra e consciente de seus próprios limites de certeza.</p>
        </div>
        <div className="solutions-list">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-item">
              <div className="solution-icon">✅</div>
              <p>{solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
