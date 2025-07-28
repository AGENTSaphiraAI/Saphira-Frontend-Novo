import React, { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import FileUploader from "./components/FileUploader";
import AnalysisDashboard from "./components/dashboard/AnalysisDashboard";
import TechnicalModal from "./components/TechnicalModal";
import { saveAs } from "file-saver";
import DOMPurify from 'dompurify';

interface ConnectionStatus {
  status: 'unknown' | 'testing' | 'online' | 'offline';
  lastChecked?: Date;
  responseTime?: number;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'padrao' | 'especialista'>('padrao');

  // Refs para controle de state
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Constantes otimizadas
  const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
  const KEEP_ALIVE_INTERVAL = 300000; // 5 minutos  
  const REQUEST_TIMEOUT = 8000; // 8 segundos

  // FUNÇÕES DE SEGURANÇA
  const sanitizeInput = useCallback((input: string): string => {
    // Remove scripts e tags HTML perigosas
    let sanitized = DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
    
    // Escape caracteres especiais
    sanitized = sanitized
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    // Limita tamanho
    if (sanitized.length > 50000) {
      sanitized = sanitized.substring(0, 50000);
    }
    
    return sanitized;
  }, []);

  const validateTextInput = useCallback((text: string): boolean => {
    // Verifica se não contém padrões suspeitos
    const suspiciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return false;
      }
    }
    
    return true;
  }, []);

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

  // Função otimizada para feedback de digitação com sanitização
  const handleTypingFeedback = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    
    // VALIDAÇÃO DE SEGURANÇA
    if (!validateTextInput(rawValue)) {
      alert("🚨 SEGURANÇA: Conteúdo suspeito detectado. Input rejeitado.");
      return;
    }
    
    // SANITIZAÇÃO
    const sanitizedValue = sanitizeInput(rawValue);
    
    setUserText(sanitizedValue);
    setIsTyping(true);

    // Limpa o timeout anterior se o usuário continuar digitando
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Define um novo timeout otimizado
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 600); // 600ms otimizado
  }, [sanitizeInput, validateTextInput]);

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

  // Handler para arquivo carregado - versão multimodal
  const handleFileContentChange = useCallback((content: string, fileName: string, file?: File) => {
    setUploadedFile({ content, name: fileName });
    if (file) {
      // Verificar limite de 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert("⚠️ Arquivo muito grande! O limite é de 10MB. Por favor, selecione um arquivo menor.");
        setSelectedFile(null);
        setUploadedFile(null);
        return;
      }
      setSelectedFile(file);
    }
    console.log(`📁 Arquivo integrado: ${fileName} (${file ? 'File object' : 'content apenas'})`);
  }, []);

  // Função de análise multimodal com estratégia Dupla Ponte
  const handleSubmit = useCallback(async (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') { e.preventDefault(); }

    const textToAnalyze = userText.trim();
    if (!selectedFile && !textToAnalyze) {
      alert("Por favor, forneça um texto ou selecione um arquivo para análise.");
      return;
    }
    if (loading) return;

    setLoading(true);
    setResult(null);
    
    let requestBody: FormData | string;
    let requestHeaders: HeadersInit = {};
    
    // --- LÓGICA DA DUPLA PONTE ---
    if (selectedFile) {
      // PONTE 1: Carga Pesada (para arquivos)
      console.log("[DUPLA_PONTE] 🚚 Usando a Ponte de Carga (FormData) para arquivo.");
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('question', specificQuestion.trim());
      formData.append('analysis_mode', analysisMode);
      requestBody = formData;
      // Para FormData, o navegador define o Content-Type automaticamente.
    } else {
      // PONTE 2: Via Expressa (para texto)
      console.log("[DUPLA_PONTE] 🚶‍♂️ Usando a Via Expressa (JSON) para texto.");
      const payload = {
        text: textToAnalyze,
        question: specificQuestion.trim(),
        analysis_mode: analysisMode,
      };
      requestBody = JSON.stringify(payload);
      requestHeaders['Content-Type'] = 'application/json';
    }
    
    console.log(`[CAIXA-PRETA] 🕵️ Tentando iniciar a análise. Endpoint: ${BACKEND_BASE_URL}/api/analyze`);

    try {
      // Criar request com timeout personalizado para análise
      const { request, cleanup } = createRequestWithTimeout(`${BACKEND_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: requestBody,
        headers: requestHeaders,
        mode: "cors",
        cache: "no-cache"
      }, 30000); // 30 segundos para análise (mais tempo que conexão)
      
      const response = await request;
      cleanup();

      console.log(`[CAIXA-PRETA] 🌐 Resposta da rede recebida. Status HTTP: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Não foi possível ler o corpo da resposta de erro.');
        throw new Error(`Erro de Servidor (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("[CAIXA-PRETA] ✨ Resposta JSON parseada com sucesso:", data);
      
      if (data && data.displayData && data.displayData.humanized_text) {
        setResult({ ...data.displayData, verificationCode: data.displayData.verificationCode });
        setShowExport(true);
      } else if (data && data.error) {
        throw new Error(`Erro retornado pelo Backend: ${data.error}`);
      } else {
        throw new Error("Formato de resposta JSON inesperado.");
      }

    } catch (error: unknown) {
      // ERROR HANDLING ROBUSTO
      console.warn("[SISTEMA] 🚨 Erro de análise detectado");
      
      let userMessage = "Erro de conexão com o servidor. Tente novamente.";
      let debugInfo = "";
      
      if (error instanceof Error) {
        debugInfo = error.name;
        
        if (error.name === 'AbortError') {
          userMessage = "Operação cancelada pelo usuário.";
        } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          userMessage = "🌐 Falha na conexão. Verifique se o backend está ativo e tente novamente.";
        } else if (error.message.includes('timeout')) {
          userMessage = "⏱️ Tempo limite excedido. O servidor pode estar sobrecarregado.";
        } else if (error.message.includes('CORS')) {
          userMessage = "🔒 Erro de política de segurança. Contate o administrador.";
        }
      }
      
      // Log detalhado para debug (sem expor dados sensíveis)
      console.warn(`[DEBUG] ${debugInfo} - User will see: ${userMessage}`);
      
      setResult({
        humanized_text: `❌ **ERRO DE ANÁLISE**\n\n${userMessage}\n\n**Sugestões:**\n• Teste a conexão usando o botão "🔗 Testar Conexão"\n• Verifique se o backend está online\n• Tente novamente em alguns segundos`,
        verificationCode: undefined
      });

    } finally {
      setLoading(false);
      console.log("[CAIXA-PRETA] 🏁 Processo de análise finalizado.");
    }
  }, [userText, specificQuestion, loading, selectedFile, analysisMode]);

  // Função de limpeza
  const handleClear = useCallback(() => {
    if (loading) return;

    setUserText("");
    setSpecificQuestion("");
    setResult(null);
    setUploadedFile(null);
    setSelectedFile(null);
    setShowExport(false);
    setAnalysisMode('padrao');
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
          onChange={(e) => {
            const rawValue = e.target.value;
            if (validateTextInput(rawValue)) {
              setSpecificQuestion(sanitizeInput(rawValue));
            } else {
              alert("🚨 SEGURANÇA: Pergunta contém conteúdo suspeito.");
            }
          }}
          disabled={loading}
          maxLength={500}
        />

        {/* Seletor de Modo de Análise */}
        <div className="analysis-mode-selector">
          <label>Nível de Profundidade:</label>
          <button 
            type="button"
            onClick={() => setAnalysisMode('padrao')}
            className={`mode-button ${analysisMode === 'padrao' ? 'active' : ''}`}
            disabled={loading}
          >
            📊 Análise Geral
          </button>
          <button 
            type="button"
            onClick={() => setAnalysisMode('especialista')}
            className={`mode-button ${analysisMode === 'especialista' ? 'active' : ''}`}
            disabled={loading}
          >
            🔬 Análise Jurídica
          </button>
        </div>
      </div>

      {/* File Uploader */}
      <FileUploader onFileContentChange={handleFileContentChange} />

      {/* Upload Status */}
      {(uploadedFile || selectedFile) && (
        <div className="saphira-upload-info">
          📁 <strong>Arquivo ativo:</strong> {selectedFile?.name || uploadedFile?.name}
          {selectedFile && (
            <span className="file-size"> ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)</span>
          )}
          <span className="priority-note">(Será usado em vez do texto manual)</span>
        </div>
      )}

      {/* Buttons */}
      <div className="saphira-buttons">
        <button 
          className={`saphira-button btn-success ${loading ? 'loading' : ''}`}
          onClick={() => handleSubmit()} 
          disabled={loading || (!userText.trim() && !selectedFile)}
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

      {/* Export Section */}
      {showExport && result && (
        <div className="saphira-export-section">
          <div className="export-buttons">
            <button 
              className="export-button"
              onClick={handleExportResponseJSON}
            >
              📄 Exportar JSON
            </button>

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

      {/* Technical Modal - Sobre a Saphira */}
      <TechnicalModal
        isOpen={isTechnicalModalOpen}
        onClose={() => setIsTechnicalModalOpen(false)}
      />
    </div>
  );
}