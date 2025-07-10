import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('Aguardando entrada...');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  // ✅ URL correta do backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://saphira-engine-guilhermegnarci.replit.app';

  const handleSubmit = async () => {
    if (!text.trim() || !question.trim()) {
      setResult('⚠️ Preencha tanto o texto quanto a pergunta.');
      setStatus('⚠️ Campos obrigatórios não preenchidos');
      return;
    }

    setIsLoading(true);
    setStatus('💙 Processando análise com carinho, Guardião...');
    setResult('');

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisData(data);

      if (data?.interpreted_response) {
        // ✅ Exibe apenas resposta interpretada
        setResult(`💬 Resposta da Saphira:\n\n${data.interpreted_response}`);
        setStatus('✨ Análise concluída! Vamos revisar juntos?');
      } else if (data?.synthesis?.summary) {
        // Backup: se não vier interpretada, exibe resumo
        setResult(`💬 Resumo:\n\n${data.synthesis.summary}`);
        setStatus('✨ Análise concluída! Vamos revisar juntos?');
      } else {
        setResult('⚠️ Resposta inesperada. Verifique o backend.');
        setStatus('⚠️ Formato de resposta inesperado');
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      console.error('URL da API:', `${API_URL}/api/analyze`);

      let errorMessage = 'Erro desconhecido';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setResult(`🚨 Erro na conexão com Saphira\n\nDetalhes: ${errorMessage}\n\nURL testada: ${API_URL}/api/analyze\n\nVerifique se o backend está rodando e acessível.`);
      setStatus('⚠️ Falha na conexão - Verifique o backend');
    } finally {
      setIsLoading(false);
    }
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

          setText(extractedText);
        } else {
          // Arquivo .txt
          setText(content);
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

  const handleClear = () => {
    setText('');
    setQuestion('');
    setResult('');
    setAnalysisData(null);
    setStatus('Campos limpos. Pronto para nova entrada.');
  };

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('🔍 Testando conexão com backend...');

    try {
      console.log('Testando URL:', `${API_URL}/api/analyze`);
      console.log('Variável de ambiente:', import.meta.env.VITE_API_URL);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: "teste de conexão",
          question: "Este é um teste?"
        }),
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
        setResult(`Erro HTTP: ${response.status}\nURL: ${API_URL}/api/analyze\nResposta: ${errorText}`);
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
      setResult(`🚨 Erro de conexão com Saphira Backend\n\nDetalhes: ${errorMessage}\n\nURL testada: ${API_URL}/api/analyze\n\nVerifique se:\n1. O backend está rodando\n2. A URL está correta\n3. Não há problemas de CORS`);
    } finally {
      setIsLoading(false);
    }
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

        <div style={{ marginBottom: '1rem' }}>
          <textarea
            rows={6}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'Arial, sans-serif',
              marginBottom: '1rem'
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole ou digite seu texto aqui..."
            disabled={isLoading}
          />

          <input
            type="text"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              fontSize: '1rem',
              fontFamily: 'Arial, sans-serif'
            }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Digite sua pergunta aqui..."
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
            onClick={handleSubmit} 
            disabled={isLoading}
            className={isLoading ? 'pulse-loading' : ''}
            style={{
              padding: '12px 24px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              border: 'none',
              background: isLoading ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
              transition: 'all 0.3s',
              opacity: isLoading ? 0.8 : 1
            }}
          >
            {isLoading ? '⏳ Analisando...' : '🔍 Analisar com Saphira'}
          </button>

          <button 
            onClick={handleClear}
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
            🧹 Limpar
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
          <div className="result-panel smooth-transition" style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.5rem',
            borderRadius: '10px',
            marginTop: '2rem',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#FFD700', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              📑 Resultado da Análise:
            </h3>
            <div className="result-content" style={{ 
              background: 'rgba(255, 255, 255, 0.15)', 
              padding: '1.5rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              overflow: 'auto',
              maxHeight: '400px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'Arial, sans-serif',
              color: '#ffffff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}>
              {result}
            </div>
            {analysisData && (
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: 'rgba(255, 215, 0, 0.1)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                fontSize: '0.9rem',
                textAlign: 'center',
                color: '#FFD700'
              }}>
                💡 Para análise técnica completa, use os botões "Exportar JSON" ou "Copiar JSON"
              </div>
            )}
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
            ✨ Novo Fluxo: Texto + Pergunta
          </h3>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              💙 <strong>Como usar:</strong> Digite seu texto e faça uma pergunta específica. 
              O backend Saphira processará ambos e retornará uma resposta humanizada e interpretada, 
              ocultando os detalhes técnicos do JSON para uma experiência mais limpa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}