import React from 'react';
import AnimatedButton from './components/AnimatedButton';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>💙 Saphira</h1>
      <p>Análise Inteligente, Técnica e Auditável</p>

      <textarea placeholder="Avalie a consistência, objetividade e qualidade técnica deste material..."></textarea>
      <input placeholder="Se desejar, escreva uma pergunta específica (opcional)..." />

      <AnimatedButton className="file-btn">
        Selecionar Arquivo (.txt, em breve .doc)
      </AnimatedButton>

      <div>
        <AnimatedButton className="primary-btn">Analisar</AnimatedButton>
        <AnimatedButton className="danger-btn">Limpar</AnimatedButton>
        <AnimatedButton className="primary-btn">Testar Conexão</AnimatedButton>
        <AnimatedButton className="secondary-btn">Sobre a Saphira</AnimatedButton>
      </div>

      <footer className="footer-note">
        🚀 Saphira • Plataforma de Análise Premium • Auditável • Transparente <br />
        🔍 Privacidade Total • Análise Técnica • Resultados Verificáveis
      </footer>
    </div>
  );
}

export default App;