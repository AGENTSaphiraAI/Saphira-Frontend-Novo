
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AboutSaphira.css';

// Novo texto estratégico da Saphira
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
  return (
    <div className="about-container">
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </div>
  );
};

export default AboutSaphira;
