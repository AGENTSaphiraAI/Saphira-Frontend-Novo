
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AboutSaphira.css';

const readmeContent = `
# 💎 Saphira: Análise Inteligente, Técnica e Auditável

## Nossa Missão: Trazer Clareza em um Mundo Complexo

Bem-vindo ao Projeto Saphira. Em uma era de sobrecarga de informações e narrativas confusas, nossa missão é simples e poderosa: fornecer uma análise técnica, neutra e auditável para qualquer conteúdo que você nos apresentar.

## O que fazemos?

*   **Privacidade Absoluta:** Os dados que você analisa são processados e esquecidos. Não armazenamos o conteúdo original.
*   **Transparência Radical:** A Saphira sempre mostrará os fatos e os dados brutos que a levaram à conclusão.
*   **Verificabilidade Incontestável:** Cada análise é selada para ser justa e baseada em evidências lógicas.

## Como usar?

Basta colar ou enviar um texto para análise. A Saphira irá processá-lo e revelar insights objetivos, ajudando você a ver além do ruído. Este projeto está em constante evolução, sua curiosidade e feedback nos movem para frente.
`;

const AboutSaphira: React.FC = () => {
  return (
    <div className="about-container">
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </div>
  );
};

export default AboutSaphira;
