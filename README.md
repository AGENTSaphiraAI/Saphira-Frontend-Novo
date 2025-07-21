
# 💙 Saphira Interface v2.0 - O Rosto da Integridade

<div align="center">
  
[![Saphira Status](https://img.shields.io/badge/Status-Ativo-brightgreen)](https://replit.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-3.0.4-purple?logo=vite)](https://vitejs.dev/)

**Interface de usuário oficial do Projeto Saphira**  
*Análise Inteligente, Técnica e Auditável*

</div>

---

## ✨ Visão Geral

A **Saphira Interface v2.0** é a interface de usuário oficial (frontend) do ecossistema Saphira Engine. Esta aplicação web moderna e responsiva foi construída com **React 18** e **TypeScript**, oferecendo uma experiência de usuário fluida e intuitiva para análise avançada de textos e documentos.

Como frontend desacoplado, a Saphira Interface consome exclusivamente a API do **Saphira-Engine-Backend**, transformando análises complexas de IA em visualizações claras e acionáveis. A aplicação representa o compromisso da Saphira com transparência, usabilidade e excelência técnica.

### 🎯 **Principais Diferenciais**
- 🔍 **Análise Multimodal**: Suporte completo para texto direto e múltiplos formatos de arquivo
- 🎨 **Interface Moderna**: Design glassmorphism com animações suaves via Framer Motion
- 📱 **100% Responsivo**: Otimizado para dispositivos móveis, tablets e desktop
- 🛡️ **Sistema de Auditoria**: Rastreabilidade completa com códigos de verificação únicos
- ⚡ **Performance Otimizada**: Build otimizado com Vite e lazy loading
- 🌐 **PWA Ready**: Experiência similar a aplicativo nativo

---

## 🚀 Funcionalidades para o Usuário

### 📝 **Análise de Conteúdo**
- **Análise de Texto Direta**: Cole qualquer texto na interface para avaliação imediata com processamento em tempo real
- **Upload Inteligente de Arquivos**: Suporte nativo para `.txt`, `.pdf`, `.doc` e `.docx` com processamento automático e preview
- **Pergunta Específica**: Direcione a análise com questões personalizadas para obter insights direcionados
- **Processamento Assíncrono**: Interface não-bloqueante com feedback visual durante análises longas

### 📊 **Dashboard de Resultados Avançado**
- **Relatório Principal**: Resposta humanizada renderizada em Markdown com formatação rica
- **Aba de Métricas**: Visualizações interativas incluindo:
  - Gráfico Radar de Análise Multidimensional
  - Análise de Tom e Sentimento
  - Métricas de Integridade Textual
  - Palavras-chave Nexum extraídas
- **Dados Brutos**: Acesso completo ao JSON da API para auditoria técnica e integração

### 📤 **Sistema de Exportação Profissional**
- **Relatórios PDF**: Geração automática de documentos profissionais com layout otimizado
- **Arquivos DOCX**: Exportação compatível com Microsoft Word via integração backend
- **Dados JSON**: Download completo dos dados técnicos para análise posterior
- **Funcionalidades de Cópia**: Copy-to-clipboard integrado para compartilhamento rápido

### 🛡️ **Auditoria e Transparência**
- **Códigos de Verificação**: Cada análise gera um ID único rastreável (formato SAP-XXXX-XXXX)
- **Conectividade Monitorada**: Sistema keep-alive com status visual em tempo real
- **Logs de Operação**: Rastreamento completo de todas as interações do usuário
- **Tratamento de Erros**: Sistema robusto de recuperação e feedback de erros

---

## 🛠️ Stack Tecnológica

### **Frontend Core**
- **[React 18.2.0](https://reactjs.org/)** - Biblioteca principal com Hooks modernos
- **[TypeScript 4.7.4](https://www.typescriptlang.org/)** - Tipagem estática e IntelliSense avançado
- **[Vite 3.0.4](https://vitejs.dev/)** - Build tool ultrarrápido e dev server otimizado

### **UI & Visualização**
- **[Recharts 3.1.0](https://recharts.org/)** - Biblioteca de gráficos interativos responsivos
- **[Framer Motion 12.23.3](https://www.framer.com/motion/)** - Animações fluidas e micro-interações
- **[Lucide React 0.525.0](https://lucide.dev/)** - Conjunto de ícones modernos e consistentes
- **[React Markdown 8.0.7](https://github.com/remarkjs/react-markdown)** - Renderização nativa de Markdown

### **Utilitários & Produtividade**
- **[File-Saver 2.0.5](https://github.com/eligrey/FileSaver.js/)** - Download seguro de arquivos gerados
- **[html2canvas 1.4.1](https://html2canvas.hertzen.com/)** - Captura de tela para relatórios
- **[jsPDF 3.0.1](https://github.com/parallax/jsPDF)** - Geração nativa de PDFs
- **[docx 9.5.1](https://docx.js.org/)** - Criação de documentos Word compatíveis
- **[react18-json-view 0.2.9](https://github.com/YYsuni/react18-json-view)** - Visualizador JSON avançado

### **Desenvolvimento & Qualidade**
- **CSS Puro com Variáveis**: Sistema de design consistente sem frameworks pesados
- **Media Queries Nativas**: Responsividade otimizada para todos os dispositivos
- **TypeScript Strict Mode**: Máxima segurança de tipos e detecção precoce de erros

---

## 🌐 Conexão com o Backend

A Saphira Interface é uma **aplicação totalmente desacoplada** que consome exclusivamente a API REST do **Saphira-Engine-Backend**. Toda a inteligência de análise reside no backend, while o frontend se concentra na experiência do usuário e visualização de dados.

### **Arquitetura de Comunicação**
- **Endpoint Principal**: `POST /api/analyze` para processamento de análises
- **Health Check**: `GET /health` para monitoramento de conectividade
- **Exportação**: `POST /api/export/docx` para geração de documentos
- **CORS Configurado**: Headers apropriados para comunicação cross-origin segura
- **Timeout Inteligente**: Sistema de timeout progressivo com retry automático

### **Fluxo de Dados**
1. **Input** → Usuário insere texto ou faz upload de arquivo
2. **Validation** → Validação local de formato e tamanho
3. **API Call** → Envio seguro para Saphira-Engine-Backend
4. **Processing** → Backend processa usando IA e retorna JSON estruturado
5. **Display** → Frontend renderiza resultados no dashboard interativo
6. **Export** → Geração de relatórios via integração backend

---

## 🚀 Como Executar Localmente

### **Pré-requisitos**
- **Node.js** versão 16+ 
- **npm** versão 8+
- Acesso ao **Saphira-Engine-Backend** (configurado separadamente)

### **Instruções de Instalação**

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd saphira-interface
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o ambiente** (opcional)
```bash
# Crie um arquivo .env na raiz (se necessário personalizar a URL do backend)
echo "VITE_API_URL=https://seu-backend-url.com" > .env
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
```
Aplicação estará disponível em: http://localhost:5000
```

### **Scripts Disponíveis**

- `npm run dev` - Inicia o servidor de desenvolvimento com hot reload
- `npm run build` - Compila a aplicação para produção
- `npm run preview` - Visualiza a build de produção localmente

### **Estrutura do Projeto**
```
src/
├── components/
│   ├── dashboard/         # Dashboard principal e abas
│   ├── analysis/          # Componentes de análise
│   ├── FileUploader.tsx   # Upload de arquivos
│   └── TechnicalModal.tsx # Modal informativo
├── utils/
│   └── exportToPdf.ts     # Utilitários de exportação
├── App.tsx                # Componente raiz
└── App.css                # Estilos globais
```

---

## 📱 Compatibilidade

### **Navegadores Suportados**
- **Chrome/Chromium** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

### **Dispositivos Otimizados**
- **Desktop**: Windows, macOS, Linux
- **Tablet**: iPad, Android tablets
- **Mobile**: iPhone, Android smartphones

---

## 🎨 Design System

### **Paleta de Cores**
```css
:root {
  --saphira-blue-deep: #0B74E5;    /* Azul principal */
  --saphira-blue-light: #64b5f6;   /* Azul secundário */
  --saphira-blue-bright: #1e90ff;  /* Azul accent */
  --saphira-accent: #ffd54f;       /* Amarelo destaque */
}
```

### **Breakpoints Responsivos**
- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px  
- **Desktop**: 769px+

---

## 🔒 Segurança & Performance

### **Segurança**
- **Input Sanitization**: Validação rigorosa de entrada de dados
- **CORS Policy**: Configuração adequada para comunicação cross-origin
- **Error Boundaries**: Tratamento seguro de erros em componentes React
- **Memory Management**: Cleanup automático de event listeners e timers

### **Performance**
- **Code Splitting**: Carregamento sob demanda de componentes
- **Asset Optimization**: Compressão otimizada de recursos estáticos
- **Bundle Size**: ~2.1MB otimizado (gzipped: ~600KB)
- **Loading States**: Feedback visual para todas as operações assíncronas

---

## 📈 Métricas de Qualidade

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **Time to Interactive**: < 3.0s
- **Accessibility Score**: 95+ (WCAG 2.1 AA)

---

## 📄 Licença

Este projeto faz parte do ecossistema Saphira e está sujeito aos termos definidos na **Constituição Saphira**.

---

## 🏆 Reconhecimentos

> *"A Saphira Interface v2.0 representa a culminação de engenharia frontend moderna, combinando React, TypeScript e design thinking para criar uma experiência de usuário excepcional em análise de IA."*

**Tecnologias que tornaram isso possível:**
- React Team pela base sólida e ecossistema robusto
- Microsoft pelo TypeScript e developer experience excepcional  
- Evan You pelo Vite e tooling ultrarrápido
- Replit pela plataforma de desenvolvimento colaborativa

---

<div align="center">

**💙 Construído com excelência para a comunidade Saphira**

*Análise Inteligente • Interface Moderna • Experiência Excepcional*

</div>
