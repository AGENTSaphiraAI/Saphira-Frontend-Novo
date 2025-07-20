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
  expert_analysis?: string;
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
  const [showExport, setShowExport] = useState(false);

  // Refs para controle de state
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constantes otimizadas
  const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
  const KEEP_ALIVE_INTERVAL = 300000; // 5 minutos  
  const REQUEST_TIMEOUT = 8000; // 8 segundos

  const placeholderExamples = [
    "Digite um artigo para verificar contradições, viés e estrutura lógica...",
    "Cole aqui um texto para análise de sentimento e tom...",
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
      // Filtrar erros conhecidos e aceitáveis
      if (event.reason?.name === 'AbortError' || 
          event.reason?.message?.includes('fetch') ||
          event.reason?.message?.includes('network') ||
          event.reason?.code === 'NETWORK_ERROR' ||
          !event.reason) {
        event.preventDefault(); // Previne log no console
        return;
      }
      
      // Log apenas erros relevantes
      if (event.reason instanceof Error) {
        console.warn('🚨 Promise rejeitada:', event.reason.message);
      }
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

    // Define um novo timeout otimizado
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 600); // 600ms otimizado
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
          }, 6000);

          const response = await request;
          cleanup();

          if (response.ok) {
            console.log("✅ Keep-alive OK");
            setKeepAliveActive(true);
          } else {
            setKeepAliveActive(false);
          }
        } catch (err) {
          // Silenciar erros de keep-alive para não gerar unhandledrejection
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
  const addAuditEntry = useCallback((originalText: string, response: string, fileName?: string, expertAnalysis?: string) => {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      originalText,
      fileName,
      response,
      verificationCode: generateVerificationCode(),
      expert_analysis: expertAnalysis
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

    // Evitar múltiplas análises simultâneas
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      await new Promise(resolve => setTimeout(resolve, 100)); // Pequena pausa
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify({
          text: textToAnalyze,
          question: specificQuestion.trim() || ""
        }),
        mode: "cors",
        cache: "no-cache",
        credentials: "omit"
      }, 20000); // Timeout de 25s

      const response = await request;
      cleanup();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Análise concluída");

      // Registrar na auditoria com verificação
      const verificationCode = addAuditEntry(
        textToAnalyze,
        data.displayData?.humanized_text || "Resposta não disponível",
        uploadedFile?.name,
        data.displayData?.expert_analysis
      );

      setResult({
        ...data.displayData,
        verificationCode
      });

      setShowExport(true);

    } catch (error: unknown) {
      let errorMessage = "Erro na análise do texto.";

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "⏱️ Tempo limite excedido. Tente novamente.";
        } else if (error.message.includes("fetch") || error.message.includes("network") || error.message.includes("Failed to fetch")) {
          errorMessage = "🌐 Problema de conectividade. Verifique sua conexão.";
        } else if (error.message.includes("HTTP")) {
          errorMessage = `⚠️ Erro do servidor: ${error.message}`;
        } else if (error.message.includes("CORS")) {
          errorMessage = "🔒 Erro de CORS. Backend pode estar inacessível.";
        }
      }

      console.warn("❌ Análise falhou:", errorMessage);
      setResult({ humanized_text: errorMessage, verificationCode: undefined });
    } finally {
      setLoading(false);
    }
  }, [userText, specificQuestion, loading, createRequestWithTimeout, uploadedFile, addAuditEntry]);

  // Função de limpeza
  const handleClear = useCallback(() => {
    if (loading) return;

    setUserText("");
    setSpecificQuestion("");
    setResult(null);
    setUploadedFile(null);
    setShowExport(false);
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

  // Função para exportar resposta em DOCX
  const handleExportDocx = useCallback(async () => {
    if (!result) {
      alert("⚠️ Nenhuma resposta para exportar.");
      return;
    }
    console.log("📥 Iniciando exportação para DOCX...");
    
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/export/docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humanized_text: result.humanized_text,
          verificationCode: result.verificationCode
        })
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const fileName = `saphira_relatorio_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.docx`;
      saveAs(blob, fileName);
      console.log(`✅ Relatório DOCX exportado: ${fileName}`);

    } catch (err) {
      console.error("❌ Erro ao exportar DOCX:", err);
      alert("Falha ao gerar o relatório DOCX. Verifique o console.");
    }
  }, [result]);

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

  // Teste de conexão otimizado
  const handleTestConnection = useCallback(async () => {
    if (connectionStatus.status === 'testing') {
      console.log("⚠️ Teste já em andamento, aguarde...");
      return;
    }

    console.log("🔗 Testando conexão com backend...");
    setConnectionStatus({ status: 'testing' });

    try {
      // Teste otimizado único
      const startTime = Date.now();
      const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/health`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        },
        mode: "cors",
        cache: "no-cache",
        credentials: "omit"
      }, 8000);

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

        console.log("✅ Conexão estabelecida com sucesso!");
        alert(`🎉 CONEXÃO OK!\n⚡ ${responseTime}ms\n🔗 Backend operacional`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }

    } catch (error: unknown) {
      setConnectionStatus({ 
        status: 'offline', 
        lastChecked: new Date() 
      });

      let errorMessage = "Erro de conexão";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Timeout na conexão";
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          errorMessage = "Erro de rede";
        }
      }

      console.warn("⚠️ Teste de conexão falhou:", errorMessage);
      alert(`⚠️ Conexão falhou: ${errorMessage}\n🔄 Tente novamente`);
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
          className={`saphira-button btn-success ${loading ? 'loading' : ''}`}
          onClick={handleAnalyze} 
          disabled={loading || (!userText.trim() && !uploadedFile?.content)}
        >
          {loading ? "🔄 Analisando..." : "🔎 Analisar"}
        </button>

        <button 
          className="saphira-button btn-danger"
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
          className="saphira-button"
          onClick={() => setIsTechnicalModalOpen(true)}
        >
          ℹ️ Sobre a Saphira
        </button>
      </div>

      {/* Export and Audit Section */}
      {showExport && (
        <div className="saphira-export-section">
          <div className="export-buttons">
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
      )}

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
          <AnalysisDashboard 
            response={result} 
            handleExportResponseJSON={handleExportResponseJSON}
            handleExportDocx={handleExportDocx}
          />
        </div>
      )}

      {/* Audit Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        history={auditLogs.map(log => ({
          id: log.id,
          timestamp: log.timestamp.toISOString(),
          originalText: log.originalText,
          displayData: {
            humanized_text: log.response,
            expert_analysis: log.expert_analysis
          },
          verification_code: log.verificationCode
        }))}
      />

      {/* Technical Modal - Sobre a Saphira */}
      <TechnicalModal
        isOpen={isTechnicalModalOpen}
        onClose={() => setIsTechnicalModalOpen(false)}
      />


    </div>
  );
}