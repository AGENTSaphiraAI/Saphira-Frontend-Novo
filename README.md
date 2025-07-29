# Saphira Interface v2.0 - Plataforma de Análise Inteligente

**Interface de usuário oficial do Ecossistema Saphira: Análise Inteligente, Técnica e Auditável.**

---

## 🎯 Visão Geral

A Saphira Interface v2.0 é uma aplicação web moderna e responsiva construída com **React 18 & TypeScript**, projetada para análise avançada de textos e documentos. Como frontend desacoplado, consome exclusivamente a API do **Saphira-Engine-Backend**, transformando análises complexas em visualizações claras e acionáveis.

## ✨ Principais Características

- **Análise Multimodal:** Suporte nativo para Texto, PDF, e DOC/DOCX.
- **Interface Moderna:** Design profissional com feedback visual claro.
- **100% Responsivo:** Otimizado para mobile, tablet e desktop.
- **Sistema de Auditoria:** Rastreabilidade completa com códigos de verificação únicos.
- **Performance Otimizada:** Build otimizado com Vite para máxima velocidade.

## 🚀 Funcionalidades Implementadas

### **1. Sistema de Análise**
- Dois Modos de Análise: "Análise Geral" para textos padrão e "Análise Jurídica" para documentos legais.
- Análise de Texto e Upload de Arquivos.
- Campo para Pergunta Específica para direcionar a análise.

### **2. Dashboard de Resultados**
- **Painel de Status:** Exibição em tempo real de "Modo de Voz", "Risco Geral" e "Confiança".
- **Relatório Principal:** Resposta humanizada da Saphira renderizada em Markdown.
- **Sistema de Exportação:** Funcionalidades para exportar a análise para os formatos JSON, DOC e PDF.

### **3. Interface Responsiva**
- Sistema de design otimizado para dispositivos móveis.
- Componentes adaptativos com breakpoints específicos.
- Navegação intuitiva em todas as plataformas.

## 🛠️ Stack Tecnológica

### **Core Framework**
- **React 18.2.0** - Biblioteca principal para UI
- **TypeScript 4.9.5** - Tipagem estática para maior robustez
- **Vite 3.2.11** - Build tool de alta performance

### **Bibliotecas de UI & Visualização**
- **Framer Motion 6.5.1** - Animações e transições suaves
- **Lucide React 0.263.1** - Ícones modernos e consistentes
- **React Markdown 8.0.7** - Renderização de conteúdo Markdown

### **Utilitários & Funcionalidades**
- **jsPDF 2.5.1** - Geração de relatórios em PDF
- **File-Saver 2.0.5** - Download de arquivos no cliente
- **Recharts 2.7.2** - Gráficos e visualizações de dados

### **Desenvolvimento**
- **ESLint** - Linting e qualidade de código
- **PostCSS** - Processamento avançado de CSS

## 🏗️ Arquitetura de Comunicação

Esta aplicação é totalmente desacoplada e consome a API REST do `Saphira-Engine-Backend`.

### **Endpoints Principais:**
- **Análise:** `POST /api/analyze` - Processamento de textos e documentos
- **Health Check:** `GET /health` - Verificação de status do backend
- **Exportação:** `POST /api/export/docx` - Geração de documentos

### **Estrutura de Comunicação:**
```
Frontend (React/TS) ←→ API REST ←→ Saphira Engine Backend
```

## 📦 Instalação e Execução

### **Pré-requisitos**
- Node.js 16+ 
- npm 8+

### **Instalação**
```bash
# 1. Clone o repositório
git clone [URL_DO_REPOSITORIO]

# 2. Instale as dependências
npm install

# 3. Configure variáveis de ambiente (opcional)
echo "VITE_API_URL=https://seu-backend-url.com" > .env

# 4. Execute o servidor de desenvolvimento
npm run dev
# Aplicação estará em: http://localhost:5000
```

### **Scripts Disponíveis**
- `npm run dev` - Servidor de desenvolvimento com hot reload
- `npm run build` - Compilação para produção
- `npm run preview` - Preview da build de produção

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/
│   │   ├── cards/                 # Cards de métricas visuais
│   │   ├── tabs/                  # Sistema de abas do dashboard
│   │   └── AnalysisDashboard.tsx  # Dashboard principal
│   ├── analysis/                  # Componentes de análise
│   ├── FileUploader.tsx           # Upload multimodal de arquivos
│   ├── TechnicalModal.tsx         # Modal "Sobre a Saphira"
│   └── AboutSaphira.tsx           # Informações técnicas
├── utils/
│   └── exportToPdf.ts             # Utilitários de exportação
├── App.tsx                        # Componente raiz com lógica principal
└── App.css                        # Sistema de design global
```

## 🎨 Design System

### **Paleta de Cores**
```css
:root {
  --saphira-blue-deep: #0B74E5;     /* Azul principal */
  --saphira-blue-light: #64B5F6;    /* Azul claro */
  --saphira-blue-bright: #1E90FF;   /* Azul brilhante */
  --saphira-accent: #FFD54F;        /* Amarelo dourado */
}
```

### **Breakpoints Responsivos**
- **Mobile:** ≤ 480px
- **Tablet:** 481px - 768px  
- **Desktop:** ≥ 769px

## 🔧 Configuração de Produção

### **Variáveis de Ambiente**
```bash
VITE_API_URL=https://api.saphira.com  # URL do backend em produção
```

### **Deploy no Replit**
1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Use o sistema de deployment integrado do Replit

## 📋 Funcionalidades Técnicas

### **Sistema de Auditoria**
- Códigos de verificação únicos para cada análise
- Rastreabilidade completa de operações
- Logs estruturados para compliance

### **Performance**
- Lazy loading de componentes
- Otimização de bundles com Vite
- Cache inteligente de requisições

### **Segurança**
- Sanitização de inputs
- Validação de tipos com TypeScript
- Headers de segurança configurados

## 🚀 Roadmap

- [ ] Sistema de autenticação
- [ ] Dashboard administrativo
- [ ] API de métricas avançadas
- [ ] Integração com mais formatos de arquivo

---

**Desenvolvido com foco em integridade, performance e uma experiência de usuário de nível profissional.**

*Ecossistema Saphira © 2024 - Análise Inteligente para o Futuro*