import React, { useState, useCallback, useRef } from "react";
import "./App.css";

// Cache global para as respostas (fora do componente)
const responseCache = new Map();

export default function App() {
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'online' | 'offline'>('unknown');

  const handleAnalyze = useCallback(async () => {
    if (!userText.trim()) return;

    // Verificar cache primeiro
    const cacheKey = `${userText.trim()}_${specificQuestion.trim()}`;
    const cachedResult = responseCache.get(cacheKey);

    if (cachedResult) {
      console.log("🚀 Usando resposta em cache");
      setResult(cachedResult);
      return;
    }

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

      // Timeout reduzido para melhor UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

      // Requisição otimizada
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin,
        },
        body: JSON.stringify({
          user_text: userText,
          question: specificQuestion || ""
        }),
        credentials: "omit",
        mode: "cors",
        cache: "force-cache", // Otimização de cache
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("📡 Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro HTTP:", response.status, response.statusText);
        throw new Error(`Erro HTTP ${response.status}: ${response.statusText}. Detalhes: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Resposta recebida:", data);

      // Salvar no cache
      responseCache.set(cacheKey, data.displayData);

      // Limpar cache antigo (manter apenas 10 entradas)
      if (responseCache.size > 10) {
        const firstKey = responseCache.keys().next().value;
        responseCache.delete(firstKey);
      }

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
  }, [specificQuestion, userText]);

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
      // PRIMEIRO: Teste GET simples na raiz
      console.log("🎯 TESTE 1: GET simples na raiz do backend");
      const getRootTest = await fetch(BACKEND_BASE_URL, {
        method: "GET",
        mode: "cors"
      }).catch(e => console.error("❌ GET raiz falhou:", e));

      if (getRootTest && getRootTest.ok) {
        console.log("✅ GET raiz funcionou! Status:", getRootTest.status);
      }

      // Timeout reduzido para teste rápido
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
            user_text: "teste básico de conexão",
            question: "este é um teste"
          }),
          mode: "cors",
          cache: "force-cache" // Cache para teste
        }).catch(err => {
          console.error("❌ API fetch error:", err);
          throw new Error(`API test failed: ${err.message}`);
        }),
        timeoutPromise(5000) // Reduzido para 5 segundos
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