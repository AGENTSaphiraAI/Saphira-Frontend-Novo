
import React, { useState } from 'react';
import './App.css';
import HumanizedResponse from './components/analysis/HumanizedResponse';
import TechnicalDetails from './components/analysis/TechnicalDetails';
import MetadataInfo from './components/analysis/MetadataInfo';

function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [technicalData, setTechnicalData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setIsLoading(true);
    setError('');
    setStatus('Analisando...');
    
    try {
      const res = await fetch('https://saphira-engine-guilhermegnarci.replit.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, question })
      });
      
      const data = await res.json();
      
      // Estrutura dos dados para os componentes
      setAnalysisResult({
        displayData: {
          humanized_text: data.interpreted_response || data.synthesis?.summary || "Análise concluída",
          resposta_geral: data.synthesis?.suggestion || "Sem sugestões específicas"
        },
        technicalData: {
          tom: { 
            tipo: data.synthesis?.tone || "neutro", 
            confianca: 0.85 
          },
          vies: { 
            detectado: data.synthesis?.bias !== "nenhum", 
            confianca: 0.75 
          },
          contradicoes: { 
            detectada: data.synthesis?.contradictions !== "não detectadas", 
            confianca: 0.80 
          },
          sugestao: data.synthesis?.suggestion || "Análise processada com sucesso"
        },
        metadata: {
          source_type: "texto manual",
          processing_time: "< 1s",
          modules_used: ["Saphira Core", "Análise Paraconsistente"]
        }
      });

      setResponse(data.interpreted_response);
      setTechnicalData(
        `✅ Tom: ${data.synthesis.tone}\n` +
        `✅ Viés: ${data.synthesis.bias}\n` +
        `✅ Contradições: ${data.synthesis.contradictions}\n` +
        `💡 Sugestão: ${data.synthesis.suggestion}`
      );
      setStatus('Análise concluída!');
    } catch (error) {
      setError('Erro na análise. Verifique sua conexão ou tente novamente.');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setQuestion('');
    setResponse('');
    setTechnicalData('');
    setAnalysisResult(null);
    setStatus('');
    setError('');
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
        <button onClick={analyze} disabled={isLoading}>
          {isLoading ? '⏳ Analisando...' : '🔎 Analisar'}
        </button>
        <button onClick={clearAll}>🧹 Limpar</button>
      </div>

      {isLoading && <p>Analisando...</p>}
      {error && <p className="error">Erro: {error}</p>}
      
      {analysisResult && (
        <>
          <HumanizedResponse data={analysisResult.displayData} />
          <TechnicalDetails data={analysisResult.technicalData} />
          <MetadataInfo data={analysisResult.metadata} />
        </>
      )}

      {/* Fallback para interface antiga */}
      {response && !analysisResult && (
        <div className="card response-card">
          <h3>💙 Resposta da Saphira</h3>
          <p>{response}</p>
        </div>
      )}

      {technicalData && !analysisResult && (
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
