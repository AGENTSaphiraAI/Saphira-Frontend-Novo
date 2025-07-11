
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
      const backendUrl = "https://saphira-engine-guilhermegmarci.replit.app/api/analyze";
      console.log("🌐 URL do backend:", backendUrl);

      // Timeout manual para evitar requests infinitos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

      const response = await fetch(backendUrl, {
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
    
    const backendUrl = "https://saphira-engine-guilhermegmarci.replit.app";
    const apiEndpoint = `${backendUrl}/api/analyze`;
    
    try {
      // Primeiro teste: verificar se o servidor está respondendo
      console.log("🌐 Testando servidor base:", backendUrl);
      
      const baseResponse = await fetch(backendUrl, {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
      });
      
      console.log("✅ Servidor base - Status:", baseResponse.status);
      console.log("✅ Servidor base - Headers:", Object.fromEntries(baseResponse.headers.entries()));
      
      // Segundo teste: verificar endpoint da API
      console.log("🎯 Testando endpoint API:", apiEndpoint);
      
      const apiResponse = await fetch(apiEndpoint, {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
          "Origin": window.location.origin
        },
        mode: "cors",
        cache: "no-cache"
      });
      
      console.log("✅ API OPTIONS - Status:", apiResponse.status);
      console.log("✅ API Headers CORS:", Object.fromEntries(apiResponse.headers.entries()));
      
      // Terceiro teste: POST de teste
      const testResponse = await fetch(apiEndpoint, {
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
      });
      
      console.log("✅ API POST - Status:", testResponse.status);
      
      if (testResponse.ok) {
        setConnectionStatus('online');
        alert(`✅ Conexão Completa OK!\n\nServidor: ${baseResponse.status}\nAPI OPTIONS: ${apiResponse.status}\nAPI POST: ${testResponse.status}\n\nBackend está funcionando!`);
      } else {
        setConnectionStatus('offline');
        const errorText = await testResponse.text();
        alert(`⚠️ Conexão Parcial\n\nServidor: OK (${baseResponse.status})\nAPI: ${testResponse.status}\n\nErro: ${errorText.substring(0, 100)}...`);
      }
      
    } catch (error: unknown) {
      console.error("❌ Erro completo no teste:", error);
      
      let errorMessage = "Erro desconhecido";
      let errorDetails = "";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Erro de rede - Backend offline ou inacessível";
        errorDetails = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorDetails = error.name;
      }
      
      setConnectionStatus('offline');
      alert(`❌ Falha na Conexão\n\nErro: ${errorMessage}\nDetalhes: ${errorDetails}\n\nVerifique se o backend está online em:\n${backendUrl}`);
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
