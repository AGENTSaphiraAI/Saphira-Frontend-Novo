
<old_str>

# Saphira Frontend

Frontend oficial do projeto Saphira, responsável por enviar textos ao backend, receber análises e exibir resultados.

## 📡 Backend conectado

- URL: https://saphira-engine-guilhermegnarci.replit.app/api/analyze

## ⚡ Funcionalidades atuais

- Entrada de texto livre
- Envio automático ao backend
- Exibição formatada do JSON de resposta
- Mensagens de status dinâmicas

## 💬 Próximos passos

- Embelezamento de interface (UI/UX)
- Botões de exportação (TXT, JSON)
- Botão de limpar conteúdo
- Animações e feedbacks visuais

## 🔄 Atualização automática

✅ Instruir o agente para atualizar este README.md sempre que:

- Nova funcionalidade for adicionada no frontend
- Alteração visual ou estrutural for realizada
- Configuração do backend ou endpoint mudar
- Qualquer modificação relevante na experiência do usuário

Ao final de cada alteração, o agente deve incluir no final deste arquivo:

### 📜 Histórico de alterações

- [2025-01-10 15:30:00 UTC] Correção de erro TypeScript no tratamento de erro unknown em catch block
- [2025-01-10 15:25:00 UTC] Criação inicial do README.md com documentação completa do projeto

---

⚡ Após aplicar, exibir mensagem: "README.md atualizado e pronto para próxima iteração."
</old_str>
<new_str>
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

-   **Interface Limpa:** Entrada de texto livre e intuitiva para o usuário.
-   **Análise em Tempo Real:** Comunicação direta com a API unificada `/api/analyze` para processamento pelo backend Saphira.
-   **Renderização Estruturada:** Exibição dos resultados da análise de forma organizada e legível, separada por módulos.
-   **Feedback ao Usuário:** Mensagens de status dinâmicas durante o processo de análise.
-   **Arquitetura Unificada e Estável:** Sistema totalmente funcional e implantado na URL de produção.

---

## 🗺️ Roadmap de Próximos Passos

-   **[UI/UX] Embelezamento e Animações:** Refinar a interface com melhores componentes visuais, animações e feedbacks para o usuário.
-   **[Funcionalidade] Exportar Relatórios:** Implementar botões de exportação da análise nos formatos JSON e TXT/PDF.
-   **[Funcionalidade] Limpar Análise:** Adicionar um botão para limpar os resultados e iniciar uma nova análise facilmente.
-   **[Visualização] Gráfico de Radar:** Transformar os scores da análise de Lógica Paraconsistente em um gráfico de radar interativo.
-   **[Visualização] Mapa Conceitual:** Ativar o módulo Nexum com uma visualização de grafo de conhecimento interativo.

---

## 📜 Histórico de alterações
- [2025-01-10 15:35:00 UTC] Atualização completa do README.md com modelo da arquitetura unificada Saphira
- [2025-01-10 15:30:00 UTC] Correção de erro TypeScript no tratamento de erro unknown em catch block
- [2025-01-10 15:25:00 UTC] Criação inicial do README.md com documentação completa do projeto
</new_str>
