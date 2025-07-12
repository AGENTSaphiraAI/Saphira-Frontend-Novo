
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";

interface ConnectionStatus {
  status: 'unknown' | 'testing' | 'online' | 'offline';
  lastChecked?: Date;
  responseTime?: number;
}

interface ApiResponse {
  humanized_text: string;
  technicalData?: {
    tom?: { tipo: string; confianca: number };
    vies?: { detectado: boolean; confianca: number };
    contradicoes?: { detectada: boolean; confianca: number };
    sugestao?: string;
  };
}

export default function App() {
  // Estados principais
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<{ humanized_text: string; technicalData?: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'unknown' });
  const [keepAliveActive, setKeepAliveActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ content: string; name: string } | null>(null);

  // Refs para controle de state
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Constantes
  const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
  const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutos
  const REQUEST_TIMEOUT = 12000; // 12 segundos

  // Utilitário para criar requests com timeout
  const createRequestWithTimeout = useCallback((url: string, options: RequestInit, timeout = REQUEST_TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return {
      request: fetch(url, { ...options, signal: controller.signal }),
      cleanup: () => clearTimeout(timeoutId)
    };
  }, []);

  // Handler global para promises rejeitadas
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Filtrar erros conhecidos que são esperados
      if (event.reason?.name === 'AbortError' || 
          event.reason?.message?.includes('fetch')) {
        return; // Ignorar erros de rede esperados
      }
      
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  // Keep-alive otimizado
  useEffect(() => {
    const startKeepAlive = () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }

      setKeepAliveActive(true);

      const pingBackend = async () => {
        try {
          const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/health`, {
            method: "GET",
            mode: "cors",
            cache: "no-cache"
          }, 8000);

          const response = await request;
          cleanup();

          if (response.ok) {
            console.log("✅ Keep-alive OK");
            setKeepAliveActive(true);
          } else {
            console.warn("⚠️ Keep-alive warning:", response.status);
            setKeepAliveActive(false);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            console.warn("⚠️ Keep-alive falhou:", err.message);
          }
          setKeepAliveActive(false);
        }
      };

      // Ping inicial após 30 segundos
      const initialTimeout = setTimeout(pingBackend, 30000);
      
      // Pings regulares
      keepAliveIntervalRef.current = setInterval(pingBackend, KEEP_ALIVE_INTERVAL);

      return () => {
        clearTimeout(initialTimeout);
        if (keepAliveIntervalRef.current) {
          clearInterval(keepAliveIntervalRef.current);
        }
      };
    };

    return startKeepAlive();
  }, [createRequestWithTimeout]);

  // Handler para arquivo carregado
  const handleFileContentChange = useCallback((content: string, fileName: string) => {
    setUploadedFile({ content, name: fileName });
    console.log(`📁 Arquivo integrado: ${fileName}`);
  }, []);

  // Função de análise otimizada com debounce
  const handleAnalyze = useCallback(async () => {
    // Priorizar arquivo carregado sobre texto manual
    const textToAnalyze = uploadedFile?.content || userText.trim();
    
    if (loading || !textToAnalyze) return;

    // Cancelar request anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setResult(null);

    console.log("🔍 Iniciando análise...");

    try {
      const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin,
        },
        body: JSON.stringify({
          text: textToAnalyze,
          question: specificQuestion.trim() || ""
        }),
        credentials: "omit",
        mode: "cors",
        cache: "no-cache"
      }, 30000);

      const response = await request;
      cleanup();

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro HTTP ${response.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log("✅ Análise concluída");
      setResult(data.displayData);

    } catch (error: unknown) {
      console.error("❌ Erro na análise:", error);

      let errorMessage = "Tive dificuldades para analisar seu texto.";

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "⏱️ Timeout: Análise cancelada. Tente novamente.";
        } else if (error.message.includes("fetch")) {
          errorMessage = "🌐 Erro de conexão. Verifique se o backend está online.";
        } else {
          errorMessage = `⚠️ ${error.message}`;
        }
      }

      setResult({ humanized_text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [userText, specificQuestion, loading, createRequestWithTimeout, uploadedFile]);

  // Função de limpeza otimizada
  const handleClear = useCallback(() => {
    if (loading) return; // Não limpar durante loading
    
    setUserText("");
    setSpecificQuestion("");
    setResult(null);
    setUploadedFile(null);
    console.log("🧹 Interface limpa");
  }, [loading]);

  // Teste de conexão otimizado
  const handleTestConnection = useCallback(async () => {
    if (connectionStatus.status === 'testing') return;

    console.log("🔗 Testando conexão...");
    const startTime = Date.now();
    
    setConnectionStatus({ status: 'testing' });

    try {
      const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({
          text: "teste de conexão",
          question: "verificar funcionamento"
        }),
        mode: "cors",
        cache: "no-cache"
      }, 10000);

      const response = await request;
      cleanup();

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.text();
        setConnectionStatus({ 
          status: 'online', 
          lastChecked: new Date(), 
          responseTime 
        });
        
        alert(`🎉 CONEXÃO ESTABELECIDA!\n\n✅ Status: ${response.status} OK\n⚡ Tempo: ${responseTime}ms\n🔗 Backend: Online\n\nResposta: ${data.substring(0, 100)}...`);
      } else {
        throw new Error(`Status ${response.status}`);
      }

    } catch (error: unknown) {
      setConnectionStatus({ 
        status: 'offline', 
        lastChecked: new Date() 
      });

      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ FALHA NA CONEXÃO\n\n${errorMsg}\n\nVerifique se o backend está online.`);
      console.error("❌ Teste de conexão falhou:", error);
    }
  }, [connectionStatus.status, createRequestWithTimeout]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>💙 Saphira</h1>
        <p className="subtitle">Análise Inteligente e Empática</p>
      </header>

      <main>
        <div className="input-section">
          <textarea
            placeholder="Digite seu texto ou pergunta para análise..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            disabled={loading}
            rows={6}
          />

          <input
            type="text"
            placeholder="Pergunta Específica (Opcional)"
            value={specificQuestion}
            onChange={(e) => setSpecificQuestion(e.target.value)}
            disabled={loading}
          />
        </div>

        <FileUploader onFileContentChange={handleFileContentChange} />

        {uploadedFile && (
          <div className="upload-info">
            📁 <strong>Arquivo ativo:</strong> {uploadedFile.name} 
            <span className="priority-note">(Será usado em vez do texto manual)</span>
          </div>
        )}

        <div className="button-group">
          <button 
            onClick={handleAnalyze} 
            disabled={loading || (!userText.trim() && !uploadedFile?.content)}
            className={loading ? "loading" : ""}
          >
            {loading ? "🔄 Analisando..." : "🔎 Analisar"}
          </button>
          
          <button 
            onClick={handleClear} 
            disabled={loading}
          >
            🧹 Limpar
          </button>
          
          <button 
            onClick={handleTestConnection} 
            disabled={connectionStatus.status === 'testing'}
            className={connectionStatus.status === 'testing' ? "loading" : ""}
          >
            {connectionStatus.status === 'testing' ? "🔄 Testando..." : "🔗 Testar Conexão"}
          </button>
        </div>

        {/* Status de Conexão */}
        <div className="status-bar">
          {connectionStatus.status !== 'unknown' && (
            <div className={`connection-status ${connectionStatus.status}`}>
              {connectionStatus.status === 'testing' && "🔄 Testando conexão..."}
              {connectionStatus.status === 'online' && (
                <>
                  ✅ Backend Online
                  {connectionStatus.responseTime && (
                    <span className="response-time"> ({connectionStatus.responseTime}ms)</span>
                  )}
                </>
              )}
              {connectionStatus.status === 'offline' && "❌ Backend Offline"}
            </div>
          )}

          {keepAliveActive && (
            <div className="keep-alive-indicator">
              🔄 Keep-alive ativo
            </div>
          )}
        </div>

        {/* Resultados */}
        {result && (
          <div className="results-section">
            <div className="response-card">
              <h3>💬 Saphira diz:</h3>
              <p>{result.humanized_text}</p>
            </div>

            {result.technicalData && (
              <details className="technical-card">
                <summary>🧾 Dados Técnicos</summary>
                <ul>
                  <li>Tom: {result.technicalData.tom?.tipo || "Indefinido"} ({Math.round((result.technicalData.tom?.confianca || 0) * 100)}%)</li>
                  <li>Viés: {result.technicalData.vies?.detectado ? "Detectado" : "Nenhum"}</li>
                  <li>Contradições: {result.technicalData.contradicoes?.detectada ? "Sim" : "Nenhuma"}</li>
                  <li>Sugestão: {result.technicalData.sugestao || "Nenhuma"}</li>
                </ul>
              </details>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
