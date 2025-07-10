
# Saphira: Aplicação Unificada de Análise de Documentos

Este é o repositório da aplicação Saphira, uma plataforma full-stack que combina um frontend moderno em React/TypeScript com um poderoso backend de análise em Python/Flask.

## 🚀 Resumo da Arquitetura

O sistema opera em um modelo unificado, onde um único servidor Flask é responsável por duas tarefas críticas:
1.  **Servir o Frontend:** Entregar a aplicação de página única (SPA) compilada para o navegador do usuário.
2.  **Processar Análises:** Expor uma API (`/api/analyze`) que executa a lógica de análise dos módulos Saphira e retorna os resultados.

Este design elimina a complexidade de múltiplos deploys e problemas de CORS, resultando em um sistema robusto, coeso e performático.

---

## 🛠️ Como Funciona o Deploy (Orquestração Replit)

O deploy é automatizado através do arquivo de configuração `.replit`:
1.  **Build do Frontend:** No momento do deploy, o comando `npm install && npm run build` é executado, compilando o código do frontend para uma pasta estática chamada `dist/`.
2.  **Execução do Backend:** Em seguida, o comando `gunicorn --reuse-port -w 4 -b 0.0.0.0:5000 main:app` inicia o servidor Python.
3.  **Serviço Unificado:** O servidor Flask, configurado em `main.py`, serve os arquivos da pasta `dist/` na rota raiz e expõe a API de análise na rota `/api/analyze`.

O backend e o frontend coexistem na mesma origem, simplificando a comunicação entre eles para uma rota relativa.

---

## ⚡ Funcionalidades Atuais

### 🔄 Fluxo de Entrada
- **Texto Manual:** Campo de textarea para inserção direta de conteúdo
- **Campo de Pergunta:** Input específico para direcionamento da análise
- **Upload de Arquivos:** Suporte para anexar arquivos .txt e .json
  - Prioridade: Se houver arquivo anexado, ele será usado na análise
  - Extração automática de texto relevante de arquivos JSON

### 🧠 Processamento e Análise
- **Integração Total:** Comunicação direta com a API unificada `/api/analyze` do backend Saphira Engine v2.0
- **Resposta Interpretada PRIORITÁRIA:** Interface exibe diretamente o campo `interpreted_response` - a resposta humanizada da Saphira
- **Sistema de Fallback Inteligente:** 
  1. **PRIORIDADE:** `interpreted_response` (resposta humanizada)
  2. **FALLBACK 1:** `synthesis.summary` (resumo técnico)
  3. **FALLBACK 2:** "Análise concluída, mas sem resposta detalhada."

### 📊 Exibição de Resultados
- **Resposta Humanizada:** Destaque para a interpretação da Saphira em linguagem natural
- **Painel de Diagnóstico:** Teste de conexão com dados técnicos formatados (status, uptime, módulos ativos)
- **Status Dinâmico:** Mensagens personalizadas e animações durante processamento

### 📤 Exportação e Compartilhamento
- **Exportar Resposta (TXT):** Salva a resposta humanizada interpretada da Saphira em arquivo .txt limpo
- **Copiar Resposta:** Copia a resposta humanizada diretamente para área de transferência
- **Exportar JSON Técnico:** Salva análise técnica completa em formato JSON (para usuários avançados)
- **Feedback Visual:** Confirmações e alertas para todas as operações com tooltips explicativos

### 🔧 Ferramentas de Desenvolvimento
- **Teste de Conexão Avançado:** Diagnóstico completo do backend com dados formatados
- **Upload Inteligente:** Detecção automática de tipo de arquivo e extração de conteúdo
- **Limpeza de Campos:** Botão para resetar interface completamente
- **Gestão de Anexos:** Visualização e remoção de arquivos anexados

### 🎨 Interface e UX
- **Design Responsivo:** Layout otimizado para desktop e mobile
- **Animações Suaves:** Transições e efeitos visuais polidos
- **Área de Gráficos:** Espaço reservado para futuras visualizações interativas
- **Status Contextual:** Mensagens dinâmicas de feedback ao usuário

---

## 🗺️ Roadmap de Próximos Passos

-   **[Visualização] Gráfico de Radar:** Transformar os scores da análise de Lógica Paraconsistente em um gráfico de radar interativo
-   **[Visualização] Mapa Conceitual:** Ativar o módulo Nexum com uma visualização de grafo de conhecimento interativo
-   **[Funcionalidade] Exportar PDF:** Adicionar opção de exportação em formato PDF para relatórios formais
-   **[UI/UX] Temas Personalizáveis:** Implementar opções de tema claro/escuro e personalização de cores
-   **[Análise] Histórico de Consultas:** Manter registro das análises anteriores para consulta rápida
-   **[Integração] API External:** Conexão com APIs externas para enriquecimento de dados

---

## 🔗 Fluxo de Uso Completo

1. **Entrada de Dados:**
   - Digite texto manualmente OU faça upload de arquivo (.txt/.json)
   - Insira pergunta específica para direcionar a análise
   - Clique em "Analisar com Saphira"

2. **Processamento:**
   - Sistema prioriza arquivo anexado sobre texto manual
   - Dados são enviados para `/api/analyze` do backend
   - Status dinâmico informa progresso da análise

3. **Resultado:**
   - **PRIORITÁRIO:** Resposta interpretada da Saphira exibida diretamente (sem prefixos técnicos)
   - Sistema de fallback: summary técnico → mensagem padrão
   - Dados técnicos JSON sempre disponíveis para usuários avançados

4. **Exportação:**
   - "Exportar Resposta (TXT)": Salva apenas a resposta humanizada interpretada
   - "Copiar Resposta": Copia resposta limpa para área de transferência
   - "Exportar JSON Técnico": Salva análise completa com metadados (para desenvolvedores)

5. **Ferramentas:**
   - "Testar Conexão": Diagnóstico detalhado do backend
   - "Limpar": Reset completo da interface
   - Gestão de anexos com preview e remoção

---

## 📜 Histórico de Alterações
- [2025-01-10 17:00:00 UTC] **v2.0 - Integração Total:** Upload de arquivos, teste de conexão avançado, novos botões de exportação, área para gráficos
- [2025-01-10 16:15:00 UTC] Interface reorganizada: resposta humanizada priorizada, novos botões TXT, área para gráficos futuros
- [2025-01-10 15:45:00 UTC] Interface humanizada com mensagens da Saphira, botões de exportação e design moderno
- [2025-01-10 15:35:00 UTC] Atualização completa do README.md com modelo da arquitetura unificada Saphira
- [2025-01-10 15:30:00 UTC] Correção de erro TypeScript no tratamento de erro unknown em catch block
- [2025-01-10 15:25:00 UTC] Criação inicial do README.md com documentação completa do projeto

---

## 🏁 Status Atual
✅ **Frontend atualizado com integração total à Saphira Engine v2.0**
- Todas as funcionalidades implementadas e testadas
- Interface otimizada para melhor experiência do usuário
- Documentação completa e atualizada
- Pronto para deploy e uso em produção
