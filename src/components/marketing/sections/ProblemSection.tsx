
import React from 'react';
import { ProblemSectionProps } from '../types';

const ProblemSection: React.FC<ProblemSectionProps> = ({
  title = "O Problema que Resolvemos",
  problems = [
    "Excesso de informações sem análise criteriosa",
    "Falta de transparência em análises de IA",
    "Ausência de auditabilidade em processos analíticos",
    "Necessidade de expertise especializada acessível"
  ]
}) => {
  return (
    <section className="marketing-problem">
      <h2 className="section-title">{title}</h2>
      <div className="problems-grid">
        {problems.map((problem, index) => (
          <div key={index} className="problem-item">
            <div className="problem-icon">⚠️</div>
            <p>{problem}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemSection;
