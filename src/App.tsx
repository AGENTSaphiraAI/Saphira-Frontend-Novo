import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'online' | 'offline'>('unknown');

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    console.log("🔍 Iniciando análise...");
    console.log("📤 Dados enviados:", { user_text: userText, question: specificQuestion });

    try {
      // URL correta do backend (conforme indicado pelo backend)
      const backendUrl = "https://7e7bc873-5ac1-4669-ac5d-3129659167a8-00-3ccd6v5wjgz9z.riker.replit.dev/api/analyze";
      
      // Fallback para desenvolvimento local se backend estiver offline
      const fallbackUrl = "/api/analyze";
      console.log("🌐 URL do backend:", backendUrl);

      // Timeout manual para evitar requests infinitos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      let response;
      
      try {
        // Tentar backend externo primeiro
        response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin,
        },
        body: JSON.stringify({
          user_text: userText,
          question: specificQuestion,
        }),
        credentials: "omit",
        mode: "cors",
        cache: "no-cache",
        signal: controller.signal
        });
      } catch (fetchError) {
        console.log("🔄 Backend externo falhou, tentando fallback local...");
        // Tentar endpoint local como fallback
        response = await fetch(fallbackUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            user_text: userText,
            question: specificQuestion,
          }),
          signal: controller.signal
        });
      }

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

    // Teste com JSONPlaceholder para verificar se fetch funciona
    const testUrl = "https://jsonplaceholder.typicode.com/posts/1";
    const backendUrl = "https://7e7bc873-5ac1-4669-ac5d-3129659167a8-00-3ccd6v5wjgz9z.riker.replit.dev";
    const apiEndpoint = `${backendUrl}/api/analyze`;

    try {
      // Timeout de 10 segundos para cada teste
      const timeoutPromise = (ms: number) => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout de conexão')), ms)
        );

      // Primeiro teste: verificar se o servidor está respondendo
      console.log("🌐 Testando servidor base:", backendUrl);

      const baseResponse = await Promise.race([
        fetch(backendUrl, {
          method: "GET",
          mode: "cors",
          cache: "no-cache"
        }).catch(err => {
          throw new Error(`Fetch failed: ${err.message}`);
        }),
        timeoutPromise(10000)
      ]) as Response;

      console.log("✅ Servidor base - Status:", baseResponse.status);
      console.log("✅ Servidor base - Headers:", Object.fromEntries(baseResponse.headers.entries()));

      // Segundo teste: verificar endpoint da API com timeout
      console.log("🎯 Testando endpoint API:", apiEndpoint);

      const testResponse = await Promise.race([
        fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Origin": window.location.origin
          },
          body: JSON.stringify({
            user_text: "teste de conexão",
            question: "este é apenas um teste"
          }),
          mode: "cors",
          cache: "no-cache"
        }).catch(err => {
          throw new Error(`API fetch failed: ${err.message}`);
        }),
        timeoutPromise(15000)
      ]) as Response;

      console.log("✅ API POST - Status:", testResponse.status);
      console.log("✅ Response Headers:", Object.fromEntries(testResponse.headers.entries()));

      if (testResponse.ok) {
        const responseData = await testResponse.text();
        console.log("✅ Response Data Preview:", responseData.substring(0, 200));
        setConnectionStatus('online');
        alert(`✅ Conexão OK!\n\nServidor: ${baseResponse.status}\nAPI: ${testResponse.status}\n\nBackend está funcionando!\n\nPrimeiros 100 chars da resposta:\n${responseData.substring(0, 100)}...`);
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