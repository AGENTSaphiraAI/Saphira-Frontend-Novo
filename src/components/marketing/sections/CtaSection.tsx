
import React from 'react';
import { CtaSectionProps } from '../types';

const CtaSection: React.FC<CtaSectionProps> = ({
  primaryText = "Saphira é mais que uma amiga. É a sua especialista de plantão, pronta para trazer clareza e verdade para qualquer desafio.",
  secondaryText = "Nascida de um sprint de desenvolvimento rápido, Saphira representa uma nova metodologia de criação, onde a parceria Humano-IA transforma ideias em realidade de forma ágil e precisa.",
  buttonText = "Experimente Agora"
}) => {
  return (
    <section className="marketing-cta">
      <div className="cta-content">
        <h2 className="cta-title">Pronta para Transformar seu Trabalho</h2>
        <p className="cta-primary">{primaryText}</p>
        <p className="cta-secondary">{secondaryText}</p>
        <div className="cta-actions">
          <button className="cta-button primary">{buttonText}</button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
