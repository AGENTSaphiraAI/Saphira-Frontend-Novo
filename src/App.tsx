
import { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setResult('Por favor, digite um texto para análise');
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText.trim() }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Erro ao conectar com o backend: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Erro detalhado:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Saphira Frontend Novo</h2>
      <textarea
        rows={5}
        cols={50}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Digite seu texto para análise..."
      />
      <br />
      <button onClick={analyzeText} style={{ marginTop: '1rem' }}>
        Analisar
      </button>
      <pre style={{ marginTop: '2rem', background: '#f4f4f4', padding: '1rem' }}>
        {result}
      </pre>
    </div>
  );
}

export default App;
