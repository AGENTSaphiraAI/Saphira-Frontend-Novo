import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import AnalysisDashboard from "./components/dashboard/AnalysisDashboard";
import AuditModal from "./components/AuditModal";
import TechnicalModal from "./components/TechnicalModal";
import { saveAs } from "file-saver";

interface ConnectionStatus {
  status: 'unknown' | 'testing' | 'online' | 'offline';
  lastChecked?: Date;
  responseTime?: number;
}



interface AuditEntry {
  id: string;
  timestamp: Date;
  originalText: string;
  fileName?: string;
  response: string;
  verificationCode: string;
}

export default function App() {
  // Estados principais
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<{ humanized_text: string; technicalData?: any; verificationCode?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'unknown' });
  const [keepAliveActive, setKeepAliveActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ content: string; name: string } | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // Refs para controle de state
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constantes
  const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
  const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutos
  const REQUEST_TIMEOUT = 12000; // 12 segundos

  
  const placeholderExamples = [
    "Cole aqui um texto para análise de sentimento e tom...",
    "Digite um artigo para verificar contradições e viés...",
    "Analise este conteúdo para detectar padrões linguísticos...",
    "Avalie a coerência e objetividade deste documento...",
    "Verifique a estrutura argumentativa desta mensagem...",
    "Examine este texto para análise técnica completa..."
  ];

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
      if (event.reason?.name === 'AbortError' || 
          event.reason?.message?.includes('fetch')) {
        return;
      }
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  // Placeholder dinâmico
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholderExamples.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Função otimizada para feedback de digitação
  const handleTypingFeedback = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserText(e.target.value);
    setIsTyping(true);

    // Limpa o timeout anterior se o usuário continuar digitando
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define um novo timeout com duração otimizada
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 800); // 800ms para UX mais suave
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

      const initialTimeout = setTimeout(pingBackend, 30000);
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

  // Utilitário para gerar código de verificação
  const generateVerificationCode = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `SAP-${timestamp.toString(36).toUpperCase()}-${random.toUpperCase()}`;
  }, []);

  // Utilitário para adicionar entrada de auditoria
  const addAuditEntry = useCallback((originalText: string, response: string, fileName?: string) => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      originalText,
      fileName,
      response,
      verificationCode: generateVerificationCode()
    };

    setAuditLogs(prev => [entry, ...prev]);
    console.log(`🛡️ Auditoria registrada: ${entry.verificationCode}`);
    return entry.verificationCode;
  }, [generateVerificationCode]);

  // Handler para arquivo carregado
  const handleFileContentChange = useCallback((content: string, fileName: string) => {
    setUploadedFile({ content, name: fileName });
    console.log(`📁 Arquivo integrado: ${fileName}`);
  }, []);

  // Função de análise otimizada
  const handleAnalyze = useCallback(async () => {
    const textToAnalyze = uploadedFile?.content || userText.trim();

    if (loading || !textToAnalyze) return;

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

      // Registrar na auditoria
      const verificationCode = addAuditEntry(
        textToAnalyze,
        data.displayData?.humanized_text || "Resposta não disponível",
        uploadedFile?.name
      );

      setResult({
        ...data.displayData,
        verificationCode
      });

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

      setResult({ humanized_text: errorMessage, verificationCode: undefined });
    } finally {
      setLoading(false);
    }
  }, [userText, specificQuestion, loading, createRequestWithTimeout, uploadedFile]);

  // Função de limpeza
  const handleClear = useCallback(() => {
    if (loading) return;

    setUserText("");
    setSpecificQuestion("");
    setResult(null);
    setUploadedFile(null);
    console.log("🧹 Interface limpa");
  }, [loading]);

  // Função para exportar resposta em JSON
  const handleExportResponseJSON = useCallback(() => {
    if (!result) {
      alert("⚠️ Nenhuma resposta para exportar.");
      return;
    }

    const exportData = {
      response: result.humanized_text,
      technicalData: result.technicalData,
      verificationCode: result.verificationCode,
      timestamp: new Date().toISOString(),
      metadata: {
        originalText: uploadedFile?.content || userText,
        fileName: uploadedFile?.name,
        question: specificQuestion
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const fileName = `saphira_response_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    saveAs(blob, fileName);

    console.log(`📥 Resposta JSON exportada: ${fileName}`);
  }, [result, uploadedFile, userText, specificQuestion]);

  // Função para exportar logs de auditoria
  const handleExportAuditLogs = useCallback(() => {
    if (auditLogs.length === 0) {
      alert("⚠️ Nenhum log de auditoria para exportar.");
      return;
    }

    const exportData = {
      exportTimestamp: new Date().toISOString(),
      totalEntries: auditLogs.length,
      auditLogs: auditLogs.map(log => ({
        ...log,
        timestamp: log.timestamp.toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const fileName = `saphira_audit_logs_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    saveAs(blob, fileName);

    console.log(`🛡️ Logs de auditoria exportados: ${fileName}`);
  }, [auditLogs]);

  // Teste de conexão aprimorado
  const handleTestConnection = useCallback(async () => {
    if (connectionStatus.status === 'testing') return;

    console.log("🔗 Testando conexão com backend...");
    console.log("🎯 [TESTE] Backend oficial:", BACKEND_BASE_URL);
    console.log("🎯 [TESTE] Health check:", `${BACKEND_BASE_URL}/health`);
    console.log("🎯 [TESTE] API endpoint:", `${BACKEND_BASE_URL}/api/analyze`);

    setConnectionStatus({ status: 'testing' });

    try {
      // TESTE 1: Verificar se backend responde (GET simples)
      console.log("🎯 TESTE 1: GET simples na raiz do backend");
      const healthResponse = await fetch(BACKEND_BASE_URL, {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
      });

      if (healthResponse.ok) {
        console.log("✅ GET raiz funcionou! Status:", healthResponse.status);
      } else {
        console.warn("⚠️ GET raiz retornou:", healthResponse.status);
      }

      // TESTE 2: Testar endpoint API específico
      console.log("🎯 TESTE 2: POST no endpoint API:", `${BACKEND_BASE_URL}/api/analyze`);
      const startTime = Date.now();

      const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({
          text: "teste de conexão automática",
          question: "verificar funcionamento do sistema"
        }),
        mode: "cors",
        cache: "no-cache"
      }, 15000); // 15 segundos timeout

      const response = await request;
      cleanup();

      const responseTime = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        setConnectionStatus({ 
          status: 'online', 
          lastChecked: new Date(), 
          responseTime 
        });

        const displayText = data.displayData?.humanized_text || data.humanized_text || "Resposta não disponível";
        
        alert(`🎉 CONEXÃO ESTABELECIDA COM SUCESSO!\n\n✅ Status: ${response.status} OK\n⚡ Tempo de resposta: ${responseTime}ms\n🔗 Backend: Totalmente operacional\n🧠 Módulos Saphira: Ativos\n\n📋 Resposta de teste:\n"${displayText.substring(0, 200)}${displayText.length > 200 ? '...' : ''}"`);
        
        console.log("✅ Teste de conexão completo - Sistema operacional!");
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

    } catch (error: unknown) {
      setConnectionStatus({ 
        status: 'offline', 
        lastChecked: new Date() 
      });

      console.error("❌ Erro no teste de conexão:", error);

      let errorMessage = "Erro desconhecido";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Timeout: Conexão demorou mais de 15 segundos";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Erro de rede - Backend inacessível";
        } else {
          errorMessage = error.message;
        }
      }

      alert(`❌ FALHA NA CONEXÃO COM BACKEND\n\n🔴 Erro: ${errorMessage}\n\n💡 Possíveis causas:\n• Backend em hibernação (aguarde 30s)\n• Problema de rede temporário\n• URL do backend incorreta\n• Timeout na requisição\n\n🔄 Tente novamente em alguns segundos.`);
    }
  }, [connectionStatus.status, createRequestWithTimeout]);

  // Cleanup ao desmontar - prevenção de vazamento de memória
  useEffect(() => {
    return () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  

  return (
    <div className="saphira-container">
      {/* Header */}
      <div className="saphira-header">
        <h1 className={`saphira-title ${isTyping ? 'logo-typing-effect' : ''}`}>💙 Saphira</h1>
        <p className="saphira-subtitle">Análise Inteligente, Técnica e Auditável</p>
      </div>

      {/* Input Section */}
      <div className="saphira-input-section">
        <textarea
          className={`saphira-textarea ${isTyping ? 'typing' : ''}`}
          placeholder={placeholderExamples[currentPlaceholder]}
          value={userText}
          onChange={handleTypingFeedback}
          disabled={loading}
          rows={6}
        />

        <input
          className="saphira-input"
          type="text"
          placeholder="Pergunta Específica (Opcional)"
          value={specificQuestion}
          onChange={(e) => setSpecificQuestion(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* File Uploader */}
      <FileUploader onFileContentChange={handleFileContentChange} />

      {/* Upload Status */}
      {uploadedFile && (
        <div className="saphira-upload-info">
          📁 <strong>Arquivo ativo:</strong> {uploadedFile.name} 
          <span className="priority-note">(Será usado em vez do texto manual)</span>
        </div>
      )}

      {/* Buttons */}
      <div className="saphira-buttons">
        <button 
          className={`saphira-button ${loading ? 'loading' : ''}`}
          onClick={handleAnalyze} 
          disabled={loading || (!userText.trim() && !uploadedFile?.content)}
        >
          {loading ? "🔄 Analisando..." : "🔎 Analisar"}
        </button>

        <button 
          className="saphira-button"
          onClick={handleClear} 
          disabled={loading}
        >
          🧹 Limpar
        </button>

        <button 
          className={`saphira-button ${connectionStatus.status === 'testing' ? 'loading' : ''}`}
          onClick={handleTestConnection} 
          disabled={connectionStatus.status === 'testing'}
        >
          {connectionStatus.status === 'testing' ? "🔄 Testando..." : "🔗 Testar Conexão"}
        </button>

        <button
          onClick={() => setIsTechnicalModalOpen(true)}
          style={{
            marginLeft: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563EB',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.39)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#1D4ED8';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🟦 Sobre a Saphira
        </button>
      </div>

      {/* Export and Audit Section */}
      <div className="saphira-export-section">
        <div className="export-buttons">
          <button 
            className="saphira-button export-button"
            onClick={handleExportResponseJSON}
            disabled={!result}
            title="Exportar resposta em formato JSON"
          >
            📥 Exportar JSON
          </button>

          <button 
            className="saphira-button audit-button"
            onClick={() => setIsAuditModalOpen(true)}
            title="Ver histórico de análises"
          >
            🛡️ Ver Auditoria ({auditLogs.length})
          </button>
        </div>

        <div className="future-exports">
          <span className="future-note">🔜 Em breve: Exportar PDF e DOC</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="saphira-status-bar">
        {connectionStatus.status !== 'unknown' && (
          <div className={`saphira-status ${connectionStatus.status}`}>
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
          <div className="saphira-keep-alive">
            🔄 Keep-alive ativo
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="saphira-results">
          <AnalysisDashboard response={result} />
        </div>
      )}

      {/* Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
        onExportLogs={handleExportAuditLogs}
      />

      {/* Technical Modal - Sobre a Saphira */}
      <TechnicalModal
        isOpen={isTechnicalModalOpen}
        onClose={() => setIsTechnicalModalOpen(false)}
      />

      
    </div>
  );
}