
import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [userText, setUserText] = useState("");
  const [specificQuestion, setSpecificQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    console.log("🔍 Iniciando análise...");
    console.log("📤 Dados enviados:", { user_text: userText, question: specificQuestion });

    try {
      const backendUrl = "https://saphira-engine-guilhermegmarci.replit.app/api/analyze";
      console.log("🌐 URL do backend:", backendUrl);

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          user_text: userText,
          question: specificQuestion,
        }),
        credentials: "omit",
        mode: "cors"
      });

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
    } catch (error) {
      console.error("💥 Erro completo na análise:", error);
      
      // Tratamento específico para diferentes tipos de erro
      let errorMessage = "Tive dificuldades para refletir sobre seu texto.";
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "🌐 Erro de conexão: Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.";
      } else if (error instanceof Error) {
        errorMessage = `⚠️ Erro: ${error.message}`;
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
    
    try {
      const backendUrl = "https://saphira-engine-guilhermegmarci.replit.app/api/analyze";
      
      const response = await fetch(backendUrl, {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors"
      });
      
      console.log("✅ Teste OPTIONS - Status:", response.status);
      console.log("✅ Headers CORS:", Object.fromEntries(response.headers.entries()));
      
      alert(`✅ Conexão OK! Status: ${response.status}`);
    } catch (error) {
      console.error("❌ Erro no teste de conexão:", error);
      alert(`❌ Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
        <button onClick={handleTestConnection}>🔗 Testar Conexão</button>
      </div>

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
