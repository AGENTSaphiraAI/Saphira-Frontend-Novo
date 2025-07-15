import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>💙 Saphira</h1>
      <p>Análise Inteligente, Técnica e Auditável</p>

      <textarea placeholder="Digite um artigo para verificar contradições e viés..."></textarea>
      <input placeholder="Pergunta Específica (Opcional)" />

      <button className="file-btn">Selecionar Arquivo (.txt, em breve .doc)</button>

      <div className="btn-group">
        <button className="primary-btn">Analisar</button>
        <button className="danger-btn">Limpar</button>
        <button className="primary-btn">Testar Conexão</button>
        <button className="secondary-btn">Sobre a Saphira</button>
      </div>

      <div className="export-group">
        <button className="secondary-btn">Exportar JSON</button>
        <button className="file-btn">Ver Auditoria (0)</button>
        <p className="footer-note">💡 Em breve: suporte completo a PDF e DOC • Exportações auditáveis • Integração NEXUM</p>
      </div>

      <footer className="footer-note">
        🚀 Saphira • Plataforma de Análise Premium • Auditável • Transparente <br />
        🔍 Privacidade Total • Análise Técnica • Resultados Verificáveis
      </footer>
    </div>
  );
}

export default App;