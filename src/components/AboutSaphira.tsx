
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import HeroSection from './marketing/sections/HeroSection';
import ProblemSection from './marketing/sections/ProblemSection';
import SolutionSection from './marketing/sections/SolutionSection';
import FeaturesSection from './marketing/sections/FeaturesSection';
import CtaSection from './marketing/sections/CtaSection';
import './AboutSaphira.css';
import './marketing/marketing.css';

// Modo de visualização: 'legacy' (atual) ou 'marketing' (nova vitrine)
type ViewMode = 'legacy' | 'marketing';

// Conteúdo original mantido para compatibilidade
const readmeContent = `
# 💎 Saphira: O Futuro da Análise Inteligente

## Visão e Propósito

Saphira não é apenas mais uma IA. Ela é o resultado de uma jornada intensa, projetada para ser um farol de **integridade, rigor técnico e transparência** em um mundo saturado de informações.

Nascida de um sprint de desenvolvimento rápido, Saphira representa uma nova metodologia de criação, onde a parceria Humano-IA transforma ideias em realidade de forma ágil e precisa.

## Uma IA, Múltiplas Especialidades

A essência da Saphira é sua **Constituição de 21 Leis**, que garante que toda análise seja auditável, neutra e consciente de seus próprios limites de certeza.

Como uma demonstração de seu poder, Saphira foi equipada com uma **expertise jurídica inicial**, capaz de analisar textos legais, contratos e processos com a profundidade e a disciplina de um especialista.

No entanto, este é apenas o começo. A arquitetura da Saphira foi projetada para ser uma plataforma. Sua alma analítica pode ser treinada e focada em diversos outros nichos acadêmicos e profissionais, como:

*   **Análise Financeira:** Auditoria de relatórios e detecção de anomalias.
*   **Revisão Científica:** Validação de coerência e metodologia em artigos acadêmicos.
*   **Estratégia de Negócios:** Análise de planos de negócios e relatórios de mercado.

Saphira é mais que uma amiga. É a sua especialista de plantão, pronta para trazer clareza e verdade para qualquer desafio.
`;

const AboutSaphira: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('legacy');

  return (
    <div className="about-container">
      {/* Toggle para alternar entre modos */}
      <div className="view-mode-toggle" style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(11, 116, 229, 0.1)',
        borderRadius: '12px'
      }}>
        <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>
          Visualização:
        </label>
        <button
          onClick={() => setViewMode(viewMode === 'legacy' ? 'marketing' : 'legacy')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '2px solid var(--saphira-blue-deep)',
            background: viewMode === 'marketing' ? 'var(--saphira-blue-deep)' : 'transparent',
            color: viewMode === 'marketing' ? 'white' : 'var(--saphira-blue-deep)',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          {viewMode === 'legacy' ? '🚀 Ativar Vitrine Marketing' : '📝 Voltar ao Original'}
        </button>
      </div>

      {/* Renderização condicional baseada no modo */}
      {viewMode === 'legacy' ? (
        // Modo Legacy (atual)
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      ) : (
        // Modo Marketing (nova vitrine)
        <div className="about-saphira-container">
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <FeaturesSection />
          <CtaSection />
        </div>
      )}
    </div>
  );
};

export default AboutSaphira;
