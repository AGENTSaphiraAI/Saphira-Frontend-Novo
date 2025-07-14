import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import AnalysisDisplay from "./components/analysis/AnalysisDisplay";
import AuditModal from "./components/AuditModal";
import AnalysisDashboard from "./components/dashboard/AnalysisDashboard";
import TechnicalModal from "./components/TechnicalModal";
import AboutSaphira from "./components/AboutSaphira";
import { saveAs } from "file-saver";

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
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analise' | 'sobre'>('analise');

  // Refs para controle de state
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constantes
  const BACKEND_BASE_URL = 'https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev';
  const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000; // 10 minutos
  const REQUEST_TIMEOUT = 12000; // 12 segundos

  // Placeholder examples - otimizado com useMemo
  const placeholderExamples = useMemo(() => [
    "Cole aqui um texto para análise de sentimento e tom...",
    "Digite um artigo para verificar contradições e viés...",
    "Analise este conteúdo para detectar padrões linguísticos...",
    "Avalie a coerência e objetividade deste documento...",
    "Verifique a estrutura argumentativa desta mensagem...",
    "Examine este texto para análise técnica completa..."
  ], []);

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

  // Keep-alive otimizado com debounce
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const startKeepAlive = () => {
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }

      const pingBackend = async () => {
        try {
          const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/health`, {
            method: "GET",
            mode: "cors",
            cache: "no-cache"
          }, 6000); // Reduzido timeout para melhor UX

          const response = await request;
          cleanup();

          if (response.ok) {
            setKeepAliveActive(true);
          } else {
            setKeepAliveActive(false);
          }
        } catch (err) {
          if (err instanceof Error && err.name !== 'AbortError') {
            console.warn("⚠️ Keep-alive falhou:", err.message);
          }
          setKeepAliveActive(false);
        }
      };

      // Debounce inicial para evitar múltiplas chamadas
      debounceTimeout = setTimeout(() => {
        pingBackend();
        keepAliveIntervalRef.current = setInterval(pingBackend, KEEP_ALIVE_INTERVAL);
      }, 2000);

      return () => {
        clearTimeout(debounceTimeout);
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

  // Teste de conexão
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

  // Cleanup ao desmontar - prevenção de vazamento de memória
  useEffect(() => {
    return () => {
      // Cleanup mais robusto
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
        keepAliveIntervalRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
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

      {/* Navegação de Abas */}
      <div className="saphira-tab-navigation">
        <button 
          onClick={() => setActiveTab('analise')} 
          className={`saphira-tab-button ${activeTab === 'analise' ? 'active' : ''}`}
        >
          📊 Análise de Dados
        </button>
        <button 
          onClick={() => setActiveTab('sobre')} 
          className={`saphira-tab-button ${activeTab === 'sobre' ? 'active' : ''}`}
        >
          💙 Sobre a Saphira
        </button>
      </div>

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
      {(result || activeTab === 'sobre') && (
        <div className="saphira-results">
          {activeTab === 'analise' && result && (
            <AnalysisDashboard response={result} />
          )}
          {activeTab === 'sobre' && (
            <AboutSaphira />
          )}
        </div>
      )}

      {/* Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        auditLogs={auditLogs}
        onExportLogs={handleExportAuditLogs}
      />

      {/* Technical Modal */}
      <TechnicalModal
        isOpen={isTechnicalModalOpen}
        onClose={() => setIsTechnicalModalOpen(false)}
        technicalData={result?.technicalData || null}
      />
    </div>
  );
}