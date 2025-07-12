import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'online' | 'offline'>('unknown');
  const [keepAliveActive, setKeepAliveActive] = useState(false);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault(); // Prevent the default unhandled rejection behavior
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Keep-alive ping para manter backend ativo
  useEffect(() => {
    const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
    
    setKeepAliveActive(true);
    
    const ping = setInterval(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/health`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          console.log("✅ Backend ping OK (keep-alive)");
          setKeepAliveActive(true);
        } else {
          console.warn("⚠️ Backend ping com status:", response.status);
          setKeepAliveActive(false);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("⚠️ Erro no ping (keep-alive):", err.message);
        }
        setKeepAliveActive(false);
      }
    }, 300000); // a cada 5 minutos (menos agressivo)

    // Ping inicial após 30 segundos (dar tempo para o app carregar)
    const initialPing = setTimeout(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        await fetch(`${BACKEND_BASE_URL}/health`, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        console.log("✅ Ping inicial do backend realizado");
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name !== 'AbortError') {
          console.log("⚠️ Ping inicial falhou:", err.message);
        }
      }
    }, 30000);

    return () => {
      clearInterval(ping);
      clearTimeout(initialPing);
    };
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    console.log("🔍 Iniciando análise...");
    console.log("📤 Dados enviados:", { user_text: userText, question: specificQuestion });

    try {
      // URL DEFINITIVA do backend (confirmada pelo diagnóstico)
      const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
      const backendUrl = `${BACKEND_BASE_URL}/api/analyze`;

      console.log("✅ URL OFICIAL do backend:", BACKEND_BASE_URL);
      console.log("✅ Endpoint completo:", backendUrl);

      // Timeout manual para evitar requests infinitos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      // Requisição direta para o backend confirmado
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin,
        },
        body: JSON.stringify({
          text: userText,
          question: specificQuestion || ""
        }),
        credentials: "omit",
        mode: "cors",
        cache: "no-cache",
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📡 Status da resposta:", response.status);
      console.log("📡 Headers da resposta:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro HTTP:", response.status, response.statusText);
        console.error("❌ Corpo da resposta de erro:", errorText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Detalhes: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Resposta recebida:", data);
      setResult(data.displayData);
    } catch (error: unknown) {
      console.error("💥 Erro completo na análise:", error);
      console.error("💥 Tipo do erro:", typeof error);
      console.error("💥 Nome do erro:", error instanceof Error ? error.constructor.name : 'unknown');

      let errorMessage = "Tive dificuldades para refletir sobre seu texto.";

      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = "⏱️ Timeout: Servidor demorou muito para responder. Tente novamente.";
      } else if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "🌐 Erro de conexão: Não foi possível conectar ao servidor. Backend pode estar offline.";
      } else if (error instanceof Error) {
        errorMessage = `⚠️ Erro: ${error.message}`;
      } else {
        errorMessage = "❓ Erro desconhecido. Verifique o console para mais detalhes.";
      }

      setResult({
        humanized_text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUserText("");
    setSpecificQuestion("");
    setResult(null);
  };

  const handleTestConnection = async () => {
    console.log("🔗 Testando conexão com backend...");
    setConnectionStatus('testing');

    // URL OFICIAL do backend (do diagnóstico)
    const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";
    const healthEndpoint = `${BACKEND_BASE_URL}/health`;
    const apiEndpoint = `${BACKEND_BASE_URL}/api/analyze`;

    console.log("🎯 [TESTE] Backend oficial:", BACKEND_BASE_URL);
    console.log("🎯 [TESTE] Health check:", healthEndpoint);
    console.log("🎯 [TESTE] API endpoint:", apiEndpoint);

    try {
      // PRIMEIRO: Teste GET simples na raiz (opcional - pode falhar)
      console.log("🎯 TESTE 1: GET simples na raiz do backend");
      try {
        const getRootTest = await fetch(BACKEND_BASE_URL, {
          method: "GET",
          mode: "cors"
        });
        
        if (getRootTest && getRootTest.ok) {
          console.log("✅ GET raiz funcionou! Status:", getRootTest.status);
        } else {
          console.log("⚠️ GET raiz retornou status:", getRootTest?.status || 'indefinido');
        }
      } catch (e) {
        console.log("ℹ️ GET raiz não disponível (normal):", e instanceof Error ? e.message : 'Erro de conexão');
      }

      // Timeout de 10 segundos para cada teste
      const timeoutPromise = (ms: number) => 
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conexão')), ms)
        );

      // Teste direto no endpoint que sabemos que funciona
      console.log("🎯 TESTE 2: POST no endpoint API:", apiEndpoint);

      const testResponse = await Promise.race([
        fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": window.location.origin
          },
          body: JSON.stringify({
            text: "teste básico de conexão",
            question: "este é um teste"
          }),
          mode: "cors",
          cache: "no-cache"
        }),
        timeoutPromise(8000)
      ]) as Response;

      console.log("✅ API Response - Status:", testResponse.status);
      console.log("✅ Response Headers:", Object.fromEntries(testResponse.headers.entries()));

      if (testResponse.ok) {
        const responseData = await testResponse.text();
        console.log("✅ API Response Preview:", responseData.substring(0, 200));
        setConnectionStatus('online');
        alert(`🎉 SAPHIRA ENGINE CONECTADA!\n\nStatus: ${testResponse.status} OK\n\n✅ Backend funcionando perfeitamente!\n\nURL: ${BACKEND_BASE_URL}\n\nResposta da Saphira:\n${responseData.substring(0, 150)}...`);
      } else {
        setConnectionStatus('offline');
        const errorText = await testResponse.text();
        console.error("❌ Error Response:", errorText);
        alert(`⚠️ Backend Respondeu com Erro\n\nStatus: ${testResponse.status}\nErro: ${errorText.substring(0, 150)}...`);
      }

    } catch (error: unknown) {
      console.error("❌ Erro no teste de conexão:", error);
      setConnectionStatus('offline');

      let errorMessage = "Erro de conexão";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(`❌ Erro de conexão com backend:\n\n${errorMessage}\n\nURL testada: ${apiEndpoint}`);
    }
  };

  return (
    <div className="container">
      <h1>💙 Saphira</h1>
      <p className="subtitle">Análise Inteligente e Empática</p>

      <textarea
        placeholder="Digite seu texto ou pergunta para análise..."
        value={userText}
        onChange={(e) => setUserText(e.target.value)}
      />

      <input
        type="text"
        placeholder="Pergunta Específica (Opcional)"
        value={specificQuestion}
        onChange={(e) => setSpecificQuestion(e.target.value)}
      />

      <div className="button-group">
        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Saphira está refletindo..." : "🔎 Analisar"}
        </button>
        <button onClick={handleClear}>🧹 Limpar</button>
        <button onClick={handleTestConnection} disabled={connectionStatus === 'testing'}>
          {connectionStatus === 'testing' ? "🔄 Testando..." : "🔗 Testar Conexão"}
        </button>
      </div>

      {connectionStatus !== 'unknown' && (
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'testing' && "🔄 Testando conexão..."}
          {connectionStatus === 'online' && "✅ Backend Online"}
          {connectionStatus === 'offline' && "❌ Backend Offline"}
        </div>
      )}

      {keepAliveActive && (
        <div className="keep-alive-indicator">
          🔄 Keep-alive ativo (Backend protegido de idle)
        </div>
      )}

      {result && (
        <>
          <div className="response-card">
            <h3>💬 Saphira diz:</h3>
            <p>{result.humanized_text}</p>
          </div>

          {result.technicalData && (
            <div className="technical-card">
              <h4>🧾 Dados Técnicos</h4>
              <ul>
                <li>Tom: {result.technicalData.tom?.tipo || "Indefinido"} ({Math.round((result.technicalData.tom?.confianca || 0) * 100)}%)</li>
                <li>Viés: {result.technicalData.vies?.detectado ? "Detectado" : "Nenhum"}</li>
                <li>Contradições: {result.technicalData.contradicoes?.detectada ? "Sim" : "Nenhuma"}</li>
                <li>Sugestão: {result.technicalData.sugestao || "Nenhuma"}</li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}