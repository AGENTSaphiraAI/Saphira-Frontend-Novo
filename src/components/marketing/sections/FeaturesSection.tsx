
import React from 'react';
import { FeaturesSectionProps } from '../types';

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  features = [
    {
      icon: "⚖️",
      title: "Análise Jurídica",
      description: "Análise de textos legais, contratos e processos com profundidade especializada"
    },
    {
      icon: "💰",
      title: "Análise Financeira",
      description: "Auditoria de relatórios e detecção de anomalias financeiras"
    },
    {
      icon: "🔬",
      title: "Revisão Científica",
      description: "Validação de coerência e metodologia em artigos acadêmicos"
    },
    {
      icon: "📈",
      title: "Estratégia de Negócios",
      description: "Análise de planos de negócios e relatórios de mercado"
    }
  ]
}) => {
  return (
    <section className="marketing-features">
      <h2 className="section-title">Funcionalidades Especializadas</h2>
      <p className="features-intro">
        Como uma demonstração de seu poder, Saphira foi equipada com uma **expertise jurídica inicial**, 
        capaz de analisar textos legais, contratos e processos com a profundidade e a disciplina de um especialista.
      </p>
      <p className="features-expansion">
        No entanto, este é apenas o começo. A arquitetura da Saphira foi projetada para ser uma plataforma. 
        Sua alma analítica pode ser treinada e focada em diversos outros nichos acadêmicos e profissionais:
      </p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
