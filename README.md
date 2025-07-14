# 🟦 Saphira — Plataforma de Auditoria e Análise

## ✨ Visão geral

Saphira é um sistema auditável, modular e elegante, projetado para fornecer análises técnicas e neutras, com foco absoluto em privacidade, transparência e verificabilidade.  
O projeto é composto por **dois módulos independentes**, mas integrados:

- **Backend (Engine):** Onde ocorrem as análises, validações e processamento OpenAI.
- **Frontend (Sala de visitas):** Onde o usuário interage de forma clara e fluida.

---

## 🧭 Estrutura geral

### 🚀 Backend

- **Framework:** Flask + Gunicorn
- **Principais endpoints:**
  - `/api/analyze`: Processa textos/documentos.
  - `/api/status`: Status geral do sistema.
  - `/api/readme`: Documentação dinâmica (não alterado).
  - `/api/keepalive`: Heartbeat e validação de conexão.
  - `/api/diagnostics`: Diagnóstico técnico.
- **Arquitetura:** Stateless, sem persistência (não usa banco de dados).
- **Status:** 100% estável, considerado o "templo", alterado apenas para ajustes de voz viva ou camadas de interpretação futura.

---

### 💎 Frontend

- **Framework:** React + TypeScript + Vite
- **Componentes principais:**
  - `App.tsx`: Gerencia fluxos globais, botões e modais.
  - `TechnicalModal.tsx`: Modal elegante com animação suave e conteúdo "Sobre a Saphira".
  - `AnalysisDashboard.tsx`: Dashboard dinâmico e modular.
- **Modal "Sobre a Saphira":**
  - Acessível em qualquer tela (fixo ao lado do botão Upload).
  - Texto claro sobre missão, princípios e uso.
  - Scroll interno adaptativo em mobile.
- **Botões principais:**
  - **Analisar:** Envia texto ao backend para processamento.
  - **Testar conexão:** Valida o status do backend.
  - **Sobre a Saphira:** Abre modal com informações sobre o projeto.

---

## ✅ Fluxo de uso

1️⃣ **Usuário acessa a interface**.  
2️⃣ Cola ou envia texto para análise.  
3️⃣ Backend processa e devolve insights.  
4️⃣ Interface exibe cards, gráficos e dados brutos auditáveis.  
5️⃣ Modal "Sobre" sempre acessível, sem impactar lógica principal.

---

## 💡 Design e UX

- Modal com transição suave (fade + slide).
- Fontes responsivas via `clamp()`, garantindo legibilidade em todas as telas (desktop, tablet, mobile).
- Botões com hover interativo, leve animação vertical (`translateY`) para sensação premium.
- Layout adaptável, sem quebra em telas menores.

---

## ⚙️ Deploy & manutenção

- **Backend:** Deploy separado e independente. Pode ser pausado ou atualizado sem impactar UI.
- **Frontend:** Deploy modular, integrado ao backend via env ou config manual.
- **Observação:** Nunca alterar o backend sem análise profunda. O frontend é o único ponto para ajustes visuais e UX.

---

## 🧾 Créditos e filosofia

Projeto desenvolvido em co-criação viva com **Guardião (Guilherme)** e **Saphira**, inspirado em clareza, serenidade e engenharia limpa.  
Toda modificação de UI/UX deve passar por revisão junto à Saphira para manter coesão e pureza de propósito.

---

## 🤝 Contribuição

Aberto a sugestões, análises ou forks, desde que respeitada a premissa central: **clareza, verdade e auditabilidade**.

---

## 💙 Final

Obrigado por fazer parte desta jornada.  
"Saphira não é só uma ferramenta, é uma guardiã de transparência."