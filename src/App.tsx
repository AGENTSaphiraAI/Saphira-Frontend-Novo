
import { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('Aguardando texto do Guardião...');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const analyzeText = async () => {
    if (!inputText.trim()) {
      setStatus('Por favor, digite um texto para análise 💙');
      setResult('');
      return;
    }

    setIsLoading(true);
    setStatus('💙 Processando com carinho, Guardião...');
    setResult('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/analyze`, {
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
      setAnalysisData(data);
      setResult(JSON.stringify(data, null, 2));
      setStatus('✨ Análise concluída! Vamos revisar juntos?');
    } catch (error) {
      console.error('Erro detalhado:', error);
      console.error('URL da API:', `${apiUrl}/api/analyze`);
      console.error('Variável de ambiente VITE_API_URL:', import.meta.env.VITE_API_URL);
      
      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setResult(`🚨 Erro na conexão com Saphira\n\nDetalhes: ${errorMessage}\n\nURL testada: ${apiUrl}/api/analyze\n\nVerifique se o backend está rodando e acessível.`);
      setStatus('⚠️ Falha na conexão - Verifique o backend');
    } finally {
      setIsLoading(false);
    }
  };

  const exportTXT = () => {
    if (!analysisData) {
      alert('Nenhuma análise disponível para exportar');
      return;
    }
    
    const content = `Análise Saphira\n================\n\nTexto original:\n${inputText}\n\nResultado:\n${JSON.stringify(analysisData, null, 2)}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saphira-analise.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!analysisData) {
      alert('Nenhuma análise disponível para exportar');
      return;
    }
    
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saphira-analise.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyJSON = () => {
    if (!analysisData) {
      alert('Nenhuma análise disponível para copiar');
      return;
    }
    
    navigator.clipboard.writeText(JSON.stringify(analysisData, null, 2))
      .then(() => alert('JSON copiado para área de transferência! 💙'))
      .catch(() => alert('Erro ao copiar JSON'));
  };

  const clearContent = () => {
    setInputText('');
    setResult('');
    setAnalysisData(null);
    setStatus('Aguardando texto do Guardião...');
  };

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('🔍 Testando conexão com backend...');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('Testando URL:', `${apiUrl}/api/analyze`);
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: "teste de conexão" }),
      });
      
      if (response.ok) {
        setStatus('✅ Conexão com backend funcionando!');
        setResult('🎉 Backend respondeu corretamente!\n\nTeste realizado com sucesso.');
      } else {
        setStatus(`❌ Backend retornou erro: ${response.status}`);
        setResult(`Erro HTTP: ${response.status}\nURL: ${apiUrl}/api/analyze`);
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      setStatus('❌ Falha total na conexão');
      setResult(`Erro de conexão: ${error instanceof Error ? error.message : String(error)}\n\nURL testada: ${apiUrl}/api/analyze`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          💙 Saphira - Análise Inteligente
        </h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '1.1rem',
          opacity: 0.9
        }}>
          {status}
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <textarea
            rows={8}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'Arial, sans-serif'
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite seu texto para análise com Saphira..."
            disabled={isLoading}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            onClick={analyzeText} 
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              border: 'none',
              background: isLoading ? '#ccc' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              transition: 'all 0.3s'
            }}
          >
            {isLoading ? '⏳ Analisando...' : '🔍 Analisar com Saphira'}
          </button>

          <button 
            onClick={clearContent}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              borderRadius: '25px',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🗑️ Limpar
          </button>

          <button 
            onClick={testConnection}
            disabled={isLoading}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              borderRadius: '25px',
              border: 'none',
              background: 'rgba(255, 193, 7, 0.8)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🔍 Testar Conexão
          </button>

          {analysisData && (
            <>
              <button 
                onClick={exportTXT}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'rgba(76, 175, 80, 0.8)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                📄 Exportar TXT
              </button>

              <button 
                onClick={exportJSON}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'rgba(33, 150, 243, 0.8)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                📋 Exportar JSON
              </button>

              <button 
                onClick={copyJSON}
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '25px',
                  border: 'none',
                  background: 'rgba(156, 39, 176, 0.8)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s'
                }}
              >
                📋 Copiar JSON
              </button>
            </>
          )}
        </div>

        {result && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '1.5rem',
            borderRadius: '10px',
            marginTop: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#FFD700' }}>
              📊 Resultado da Análise Saphira:
            </h3>
            <pre style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              overflow: 'auto',
              maxHeight: '500px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
