
import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('Aguardando entrada...');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [humanizedResponse, setHumanizedResponse] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [connectionTestResult, setConnectionTestResult] = useState<any>(null);

  // ✅ URL correta do backend
  const API_URL = import.meta.env.VITE_API_URL || 'https://saphira-engine-guilhermegnarci.replit.app';

  const handleSubmit = async () => {
    // Priorizar anexo se existir, senão usar texto manual
    const finalText = uploadedFile ? await readFileContent(uploadedFile) : text.trim();
    
    if (!finalText || !question.trim()) {
      setResult('⚠️ Para uma análise completa da Saphira, é necessário:\n\n1️⃣ Texto ou arquivo para análise\n2️⃣ Pergunta específica sobre o conteúdo\n\n💡 A Saphira precisa saber O QUE analisar e QUAL pergunta responder!');
      setStatus('⚠️ Campos obrigatórios: texto/arquivo + pergunta');
      return;
    }

    setIsLoading(true);
    setStatus('💙 Processando análise com carinho, Guardião...');
    setResult('');
    setHumanizedResponse('');

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: finalText,
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisData(data);

      if (data?.interpreted_response) {
        // ✅ PRIORIDADE MÁXIMA: Resposta interpretada humanizada
        setResult(data.interpreted_response);
        setHumanizedResponse(data.interpreted_response);
        setStatus('✨ Saphira analisou seu conteúdo! Confira a resposta interpretada abaixo.');
      } else if (data?.synthesis?.summary) {
        // FALLBACK 1: Resumo técnico disponível
        setResult(data.synthesis.summary);
        setHumanizedResponse(data.synthesis.summary);
        setStatus('✨ Análise concluída! Resumo disponível (resposta interpretada não gerada).');
      } else {
        // FALLBACK 2: Mensagem padrão
        const fallbackMessage = 'Análise concluída, mas sem resposta detalhada.';
        setResult(fallbackMessage);
        setHumanizedResponse(fallbackMessage);
        setStatus('✨ Análise processada, mas sem interpretação detalhada disponível.');
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

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.toLowerCase().endsWith('.json')) {
            const jsonData = JSON.parse(content);
            // Extrair texto relevante do JSON
            let extractedText = '';
            if (jsonData.text) extractedText = jsonData.text;
            else if (jsonData.content) extractedText = jsonData.content;
            else if (jsonData.message) extractedText = jsonData.message;
            else if (jsonData.description) extractedText = jsonData.description;
            else if (typeof jsonData === 'string') extractedText = jsonData;
            else extractedText = JSON.stringify(jsonData, null, 2);
            resolve(extractedText);
          } else {
            resolve(content);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
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

    setUploadedFile(file);
    setStatus(`📁 Arquivo ${file.name} carregado! Será usado na análise.`);
    setResult('');

    // Limpar o input para permitir upload do mesmo arquivo novamente
    event.target.value = '';
  };

  const handleClear = () => {
    setText('');
    setQuestion('');
    setResult('');
    setAnalysisData(null);
    setHumanizedResponse('');
    setUploadedFile(null);
    setConnectionTestResult(null);
    setStatus('Campos limpos. Pronto para nova entrada.');
  };

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('🔍 Testando conexão com backend...');
    setConnectionTestResult(null);

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
        
        // Formatar dados técnicos de forma legível
        const formattedData = {
          status: '✅ Conectado',
          response_time: 'Rápida',
          backend_url: `${API_URL}/api/analyze`,
          modules_active: data?.modules || 'Detectado automaticamente',
          synthesis_available: data?.synthesis ? '✅ Sim' : '❌ Não',
          interpreted_response_available: data?.interpreted_response ? '✅ Sim' : '❌ Não',
          timestamp: new Date().toLocaleString()
        };
        
        setConnectionTestResult(formattedData);
        setResult('🎉 Backend respondeu corretamente!\n\nTeste realizado com sucesso.');
      } else {
        const errorText = await response.text();
        setStatus(`❌ Backend retornou erro: ${response.status}`);
        
        const errorData = {
          status: `❌ Erro ${response.status}`,
          backend_url: `${API_URL}/api/analyze`,
          error_details: errorText,
          timestamp: new Date().toLocaleString()
        };
        
        setConnectionTestResult(errorData);
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
      
      const errorData = {
        status: '❌ Desconectado',
        backend_url: `${API_URL}/api/analyze`,
        error_type: error instanceof Error ? error.name : 'UnknownError',
        error_message: errorMessage,
        timestamp: new Date().toLocaleString()
      };
      
      setConnectionTestResult(errorData);
      setResult(`🚨 Erro de conexão com Saphira Backend\n\nDetalhes: ${errorMessage}\n\nURL testada: ${API_URL}/api/analyze\n\nVerifique se:\n1. O backend está rodando\n2. A URL está correta\n3. Não há problemas de CORS`);
    } finally {
      setIsLoading(false);
    }
  };

  const exportTXT = () => {
    if (!humanizedResponse) {
      alert('Nenhuma resposta humanizada disponível para exportar');
      return;
    }

    const blob = new Blob([humanizedResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saphira-resposta.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTXT = () => {
    if (!humanizedResponse) {
      alert('Nenhuma resposta humanizada disponível para copiar');
      return;
    }

    navigator.clipboard.writeText(humanizedResponse)
      .then(() => alert('Resposta copiada para área de transferência! 💙'))
      .catch(() => alert('Erro ao copiar resposta'));
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

        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ 
            fontSize: '1.1rem',
            opacity: 0.9,
            marginBottom: '0.5rem'
          }}>
            {status}
          </p>
          <p style={{ 
            fontSize: '0.95rem',
            opacity: 0.8,
            fontStyle: 'italic',
            margin: 0,
            color: '#FFD700'
          }}>
            🤖 A Saphira analisa seu conteúdo e responde à sua pergunta de forma humanizada e inteligente
          </p>
        </div>

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
            placeholder="Cole ou digite seu texto aqui para análise... (ou anexe um arquivo .txt/.json usando o botão de upload)"
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
              fontFamily: 'Arial, sans-serif',
              marginBottom: '1rem'
            }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Faça uma pergunta específica sobre o conteúdo que será analisado..."
            disabled={isLoading}
          />

          {uploadedFile && (
            <div style={{
              background: 'rgba(76, 175, 80, 0.2)',
              padding: '0.8rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid rgba(76, 175, 80, 0.5)'
            }}>
              📎 Arquivo anexado: <strong>{uploadedFile.name}</strong>
              <button
                onClick={() => setUploadedFile(null)}
                style={{
                  marginLeft: '1rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  border: 'none',
                  background: 'rgba(244, 67, 54, 0.8)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ✕ Remover
              </button>
            </div>
          )}
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
        </div>

        {connectionTestResult && (
          <div style={{
            background: 'rgba(0, 123, 255, 0.2)',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            border: '2px solid rgba(0, 123, 255, 0.4)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#87CEEB' }}>
              🔧 Diagnóstico de Conexão:
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              {Object.entries(connectionTestResult).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {String(value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="result-panel smooth-transition" style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1.5rem',
            borderRadius: '10px',
            marginTop: '2rem',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#FFD700', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              🤖 Resposta Interpretada da Saphira:
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

            {/* Botões de exportação */}
            {(humanizedResponse || analysisData) && (
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {humanizedResponse && (
                  <>
                    <button 
                      onClick={exportTXT}
                      style={{
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        borderRadius: '20px',
                        border: 'none',
                        background: 'rgba(76, 175, 80, 0.8)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                      }}
                      title="Salvar resposta humanizada da Saphira em arquivo .txt"
                    >
                      📄 Exportar Resposta (TXT)
                    </button>

                    <button 
                      onClick={copyTXT}
                      style={{
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        borderRadius: '20px',
                        border: 'none',
                        background: 'rgba(255, 152, 0, 0.8)',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                      }}
                      title="Copiar resposta humanizada para área de transferência"
                    >
                      📋 Copiar Resposta
                    </button>
                  </>
                )}

                {analysisData && (
                  <button 
                    onClick={exportJSON}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.9rem',
                      borderRadius: '20px',
                      border: 'none',
                      background: 'rgba(33, 150, 243, 0.8)',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                    title="Exportar dados técnicos completos (para usuários avançados)"
                  >
                    🔧 Exportar JSON Técnico
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Área reservada para gráficos futuros */}
        <div style={{
          marginTop: '2rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '15px',
          textAlign: 'center',
          border: '2px dashed rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '1.5rem',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            <h3 style={{ 
              marginBottom: '1rem', 
              color: '#FFD700',
              fontSize: '1.3rem',
              opacity: 0.8
            }}>
              📊 Área reservada para gráficos futuros
            </h3>
            <p style={{ 
              fontSize: '1rem', 
              lineHeight: '1.6', 
              margin: 0,
              opacity: 0.7,
              fontStyle: 'italic'
            }}>
              Em breve: Visualizações interativas, gráficos de radar para Lógica Paraconsistente e mapas conceituais do módulo Nexum serão exibidos aqui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
