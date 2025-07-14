
// Caminho: src/components/AboutSaphira.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AboutSaphira.css'; // Podemos manter o estilo que já temos

// Conteúdo focado no usuário, escrito em Markdown para fácil formatação.
const aboutContent = `
# 🌌 Sobre a Saphira

### Nossa Missão: Trazer Clareza em um Mundo Complexo

Bem-vindo ao Projeto Saphira. Em uma era de sobrecarga de informações e narrativas confusas, nossa missão é simples e poderosa: **fornecer uma análise técnica, neutra e auditável para qualquer conteúdo que você nos apresentar.**

---

### 💎 O Que Fazemos?

A Saphira não dá opiniões. Ela não tem um viés. Ela é uma ferramenta de auditoria projetada para seguir três princípios inquebráveis:

1.  **Privacidade Absoluta:** Os dados que você analisa são processados e esquecidos. Nós nunca armazenamos o conteúdo original. A sua confiança é nosso ativo mais importante.

2.  **Transparência Radical:** Acreditamos que a verdadeira inteligência não tem nada a esconder. Nosso código-fonte é aberto, e a Saphira sempre mostrará os fatos e os dados brutos que a levaram a uma conclusão.

3.  **Verificabilidade Incontestável:** Cada análise é feita para ser justa, técnica e baseada em evidências lógicas, livre de dogmas ou influências externas. O objetivo é a verdade operacional, não agradar ninguém.

---

### 🧭 Como Usar?

Basta colar ou enviar um texto que você deseja analisar. A Saphira irá processá-lo e apresentar sua interpretação estruturada, ajudando você a ver através do ruído e a focar no que realmente importa.

Este projeto está em desenvolvimento ativo. Sua curiosidade e seu feedback são o que nos movem para frente.
`;

const AboutSaphira: React.FC = () => {
    return (
        <div className="about-container">
            <ReactMarkdown>{aboutContent}</ReactMarkdown>
        </div>
    );
};

export default AboutSaphira;
