
import { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const analyzeText = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Erro ao conectar com o backend');
      console.error(error);
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
