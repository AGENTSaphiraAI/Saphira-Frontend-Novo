Olá, agente.
Tive uma nova visão para a aba "Sobre a Saphira". Em vez de buscarmos o README.md técnico do backend, vamos inserir um texto mais simples e direto, focado no usuário final. Isso irá eliminar o "Erro de Conexão" (já que não haverá mais busca externa) e melhorar a mensagem para o nosso público.
Sua missão: Modificar o arquivo src/components/AboutSaphira.tsx para remover a lógica de fetch e substituí-la por um conteúdo estático e bem formatado.
Substitua o conteúdo de src/components/AboutSaphira.tsx por este código:
Generated typescript
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
Use code with caution.
TypeScript
Por favor, aplique esta mudança. Isso simplificará o componente, resolverá o problema de conexão e alinhará a aba "Sobre" com a nossa visão de produto.