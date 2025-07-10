
import { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('Aguardando texto do Guardião...');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Função para formatar resultado de forma humanizada
  const formatHumanizedResult = (data: any) => {
    let humanResult = '';
    
    // Synthesis Summary
    if (data?.synthesis?.summary) {
      humanResult += `📊 RESUMO EXECUTIVO\n${data.synthesis.summary}\n\n`;
    }
    
    // Context Module
    if (data?.context) {
      humanResult += `🎯 ANÁLISE DE CONTEXTO\n`;
      if (data.context.main_topic) {
        humanResult += `• Tópico Principal: ${data.context.main_topic}\n`;
      }
      if (data.context.key_entities && data.context.key_entities.length > 0) {
        humanResult += `• Entidades Identificadas: ${data.context.key_entities.join(', ')}\n`;
      }
      if (data.context.urgency_level) {
        humanResult += `• Nível de Urgência: ${data.context.urgency_level}\n`;
      }
      humanResult += '\n';
    }
    
    // Paraconsistent Logic
    if (data?.paraconsistent) {
      humanResult += `🧠 LÓGICA PARACONSISTENTE\n`;
      if (data.paraconsistent.truth_score !== undefined) {
        humanResult += `• Score de Verdade: ${(data.paraconsistent.truth_score * 100).toFixed(1)}%\n`;
      }
      if (data.paraconsistent.contradiction_score !== undefined) {
        humanResult += `• Score de Contradição: ${(data.paraconsistent.contradiction_score * 100).toFixed(1)}%\n`;
      }
      if (data.paraconsistent.certainty_level) {
        humanResult += `• Nível de Certeza: ${data.paraconsistent.certainty_level}\n`;
      }
      if (data.paraconsistent.recommendation) {
        humanResult += `• Recomendação: ${data.paraconsistent.recommendation}\n`;
      }
      humanResult += '\n';
    }
    
    // Sentiment Analysis
    if (data?.sentiment) {
      humanResult += `💭 ANÁLISE DE SENTIMENTO\n`;
      if (data.sentiment.polarity !== undefined) {
        const polarityText = data.sentiment.polarity > 0 ? 'Positivo' : 
                           data.sentiment.polarity < 0 ? 'Negativo' : 'Neutro';
        humanResult += `• Polaridade: ${polarityText} (${data.sentiment.polarity.toFixed(2)})\n`;
      }
      if (data.sentiment.subjectivity !== undefined) {
        humanResult += `• Subjetividade: ${(data.sentiment.subjectivity * 100).toFixed(1)}%\n`;
      }
      humanResult += '\n';
    }
    
    return humanResult || 'Análise processada, mas sem dados formatados disponíveis.';
  };

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
      
      // Mostrar resultado humanizado em vez de JSON bruto
      const humanizedResult = formatHumanizedResult(data);
      setResult(humanizedResult);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (!['txt', 'json'].includes(fileExtension || '')) {
      setResult('⚠️ Tipo de arquivo não suportado. Use apenas arquivos .txt ou .json');
      setStatus('Erro no upload - Formato não suportado');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (fileExtension === 'json') {
          // Tentar parsear JSON e extrair texto relevante
          const jsonData = JSON.parse(content);
          let extractedText = '';
          
          // Buscar propriedades comuns que podem conter texto
          if (jsonData.text) extractedText = jsonData.text;
          else if (jsonData.content) extractedText = jsonData.content;
          else if (jsonData.message) extractedText = jsonData.message;
          else if (jsonData.description) extractedText = jsonData.description;
          else if (typeof jsonData === 'string') extractedText = jsonData;
          else extractedText = JSON.stringify(jsonData, null, 2);
          
          setInputText(extractedText);
        } else {
          // Arquivo .txt
          setInputText(content);
        }
        
        setStatus(`📁 Arquivo ${file.name} carregado com sucesso!`);
        setResult('');
      } catch (error) {
        setResult(`⚠️ Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Formato inválido'}`);
        setStatus('Erro no processamento do arquivo');
      }
    };

    reader.onerror = () => {
      setResult('⚠️ Erro ao ler o arquivo');
      setStatus('Erro na leitura do arquivo');
    };

    reader.readAsText(file);
    
    // Limpar o input para permitir upload do mesmo arquivo novamente
    event.target.value = '';
  };

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('🔍 Testando conexão com backend...');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('Testando URL:', `${apiUrl}/api/analyze`);
      console.log('Variável de ambiente:', import.meta.env.VITE_API_URL);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: "teste de conexão" }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setStatus('✅ Conexão com backend funcionando!');
        setResult('🎉 Backend respondeu corretamente!\n\nTeste realizado com sucesso.\n\nResposta: ' + JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        setStatus(`❌ Backend retornou erro: ${response.status}`);
        setResult(`Erro HTTP: ${response.status}\nURL: ${apiUrl}/api/analyze\nResposta: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro no teste completo:', error);
      let errorMessage = 'Erro desconhecido';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'Timeout - Backend não respondeu em 10 segundos';
        } else {
          errorMessage = error.message;
        }
      }
      
      setStatus('❌ Falha total na conexão');
      setResult(`🚨 Erro de conexão com Saphira Backend\n\nDetalhes: ${errorMessage}\n\nURL testada: ${import.meta.env.VITE_API_URL}/api/analyze\n\nVerifique se:\n1. O backend está rodando\n2. A URL está correta\n3. Não há problemas de CORS`);
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

          <label 
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              borderRadius: '25px',
              border: 'none',
              background: 'rgba(103, 58, 183, 0.8)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}
          >
            📁 Upload Arquivo
            <input
              type="file"
              accept=".txt,.json,application/json,text/plain"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>

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
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              lineHeight: '1.6',
              overflow: 'auto',
              maxHeight: '500px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Arial, sans-serif'
            }}>
              {result}
            </div>
          </div>
        )}

        {/* Seção de Créditos */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '15px',
          textAlign: 'center',
          borderTop: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h3 style={{ 
            marginBottom: '1rem', 
            color: '#FFD700',
            fontSize: '1.5rem'
          }}>
            ✨ Créditos e Reconhecimentos
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '10px',
              backdropFilter: 'blur(5px)'
            }}>
              <h4 style={{ color: '#87CEEB', marginBottom: '0.5rem' }}>🧠 Saphira Engine</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                Sistema de análise avançada com Lógica Paraconsistente, 
                módulos de contexto e processamento inteligente de texto.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '10px',
              backdropFilter: 'blur(5px)'
            }}>
              <h4 style={{ color: '#98FB98', marginBottom: '0.5rem' }}>⚡ Tecnologias</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                Frontend: React + TypeScript + Vite<br/>
                Backend: Python + Flask + Gunicorn<br/>
                Deploy: Replit Infrastructure
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '10px',
              backdropFilter: 'blur(5px)'
            }}>
              <h4 style={{ color: '#DDA0DD', marginBottom: '0.5rem' }}>🎨 Interface</h4>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                Design moderno com gradientes, animações suaves e 
                experiência do usuário otimizada para análise de documentos.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 215, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <p style={{ 
              fontSize: '0.9rem', 
              fontStyle: 'italic',
              margin: 0,
              color: '#FFD700'
            }}>
              💙 "Desenvolvido com carinho para revolucionar a análise de documentos" 
              <br/>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Versão 2.0 - Janeiro 2025
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
