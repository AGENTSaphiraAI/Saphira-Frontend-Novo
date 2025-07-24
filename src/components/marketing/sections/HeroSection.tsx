
import React from 'react';
import { HeroSectionProps } from '../types';

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "💎 Saphira: O Futuro da Análise Inteligente",
  subtitle = "Análise Inteligente, Técnica e Auditável",
  description = "Saphira não é apenas mais uma IA. Ela é o resultado de uma jornada intensa, projetada para ser um farol de **integridade, rigor técnico e transparência** em um mundo saturado de informações."
}) => {
  return (
    <section className="marketing-hero">
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <div className="hero-description">
        <p>{description}</p>
      </div>
    </section>
  );
};

export default HeroSection;
