import React, { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [technicalData, setTechnicalData] = useState('');
  const [status, setStatus] = useState('');

  const analyze = async () => {
    setStatus('Analisando...');
    try {
      const res = await fetch('https://saphira-engine-guilhermegnarci.replit.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, question })
      });
      const data = await res.json();
      setResponse(data.interpreted_response);
      setTechnicalData(
        `✅ Tom: ${data.synthesis.tone}\n` +
        `✅ Viés: ${data.synthesis.bias}\n` +
        `✅ Contradições: ${data.synthesis.contradictions}\n` +
        `💡 Sugestão: ${data.synthesis.suggestion}`
      );
      setStatus('Análise concluída!');
    } catch (error) {
      setStatus('Erro na análise. Verifique sua conexão ou tente novamente.');
    }
  };

  const clearAll = () => {
    setText('');
    setQuestion('');
    setResponse('');
    setTechnicalData('');
    setStatus('');
  };

  return (
    <div className="container">
      <h1>💙 Saphira</h1>
      <h2>Análise Inteligente</h2>
      <p className="status">{status || 'Digite ou cole seu texto para análise.'}</p>

      <textarea
        placeholder="Digite sua pergunta ou cole o texto que deseja analisar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Pergunta Específica (Opcional)"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="button-group">
        <button onClick={analyze}>🔎 Analisar</button>
        <button onClick={clearAll}>🧹 Limpar</button>
      </div>

      {response && (
        <div className="card response-card">
          <h3>💙 Resposta da Saphira</h3>
          <p>{response}</p>
        </div>
      )}

      {technicalData && (
        <div className="card tech-card">
          <h4>📄 Dados Técnicos</h4>
          <pre>{technicalData}</pre>
        </div>
      )}

      <footer>
        <p>📄 Área reservada para módulos futuros (Nexum, ScanCross)</p>
      </footer>
    </div>
  );
}

export default App;