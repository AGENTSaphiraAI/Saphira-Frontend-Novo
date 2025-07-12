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
      const BACKEND_BASE_URL = "https://7e7bc873-5ac1-4669-ac5d-3129659167a8-00-3ccd6v5wjgz9z.riker.replit.dev";
      const backendUrl = `${BACKEND_BASE_URL}/api/analyze`;
      
      console.log("🌐 URL do backend:", backendUrl);

      // Timeout mais curto para falhar rápido
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos

      let response;
      let backendWorking = false;
      
      try {
        // Tentar backend externo primeiro
        response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            user_text: userText,
            question: specificQuestion,
          }),
          mode: "cors",
          cache: "no-cache",
          signal: controller.signal
        });
        
        if (response.ok) {
          backendWorking = true;
          clearTimeout(timeoutId);
          const data = await response.json();
          console.log("✅ Resposta do backend:", data);
          setResult(data.displayData);
          return;
        }
      } catch (fetchError) {
        console.log("🔄 Backend externo não disponível, usando modo local...");
      }
      
      clearTimeout(timeoutId);

      // MODO LOCAL: Análise simulada inteligente
      console.log("🧠 Executando análise local...");
      
      const mockAnalysis = generateMockAnalysis(userText, specificQuestion);
      setResult(mockAnalysis);

    } catch (error: unknown) {
      console.error("💥 Erro na análise:", error);
      
      // Fallback final com análise local
      const mockAnalysis = generateMockAnalysis(userText, specificQuestion);
      setResult(mockAnalysis);
    } finally {
      setLoading(false);
    }
  };

  // Função para gerar análise simulada inteligente
  const generateMockAnalysis = (text: string, question: string) => {
    const textLength = text.length;
    const hasQuestion = question && question.trim().length > 0;
    
    let analysis = "";
    
    if (textLength === 0) {
      analysis = "🤔 Você esqueceu de escrever algo! Digite seu texto para que eu possa analisá-lo.";
    } else if (textLength < 50) {
      analysis = `✨ Analisando seu texto curto (${textLength} caracteres). Parece ser uma reflexão concisa.`;
    } else if (textLength < 200) {
      analysis = `📝 Texto de tamanho médio detectado (${textLength} caracteres). Vejo elementos interessantes para análise.`;
    } else {
      analysis = `📚 Texto extenso identificado (${textLength} caracteres). Uma análise aprofundada seria ideal.`;
    }
    
    if (hasQuestion) {
      analysis += `\n\n💭 Pergunta específica: "${question}"\nEsta pergunta direcionará minha análise para aspectos mais específicos.`;
    }
    
    analysis += "\n\n⚠️ **Modo Local Ativo**: O backend Saphira não está disponível no momento. Esta é uma análise simulada do frontend.";
    
    return {
      humanized_text: analysis,
      technicalData: {
        tom: { tipo: "neutro", confianca: 0.75 },
        vies: { detectado: false, confianca: 0.80 },
        contradicoes: { detectada: false, confianca: 0.85 },
        sugestao: "Conecte-se ao backend para análise completa da Saphira."
      }
    };
  };

  const handleClear = () => {
    setUserText("");
    setSpecificQuestion("");
    setResult(null);
  };

  const handleTestConnection = async () => {
    console.log("🔗 Testando conexão com backend...");
    setConnectionStatus('testing');

    const BACKEND_BASE_URL = "https://7e7bc873-5ac1-4669-ac5d-3129659167a8-00-3ccd6v5wjgz9z.riker.replit.dev";
    const apiEndpoint = `${BACKEND_BASE_URL}/api/analyze`;
    
    console.log("🔧 [TESTE] URL testada:", apiEndpoint);

    try {
      // Teste rápido e direto
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

      const testResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_text: "teste de conexão",
          question: "este é apenas um teste"
        }),
        mode: "cors",
        cache: "no-cache",
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log("✅ Status:", testResponse.status);

      if (testResponse.ok) {
        const responseData = await testResponse.text();
        console.log("✅ Resposta:", responseData.substring(0, 200));
        setConnectionStatus('online');
        alert(`✅ Backend Online!\n\nStatus: ${testResponse.status}\nResposta: ${responseData.substring(0, 100)}...`);
      } else {
        setConnectionStatus('offline');
        const errorText = await testResponse.text();
        console.error("❌ Erro HTTP:", testResponse.status, errorText);
        alert(`⚠️ Backend com Problema\n\nStatus: ${testResponse.status}\nErro: ${errorText.substring(0, 100)}...`);
      }

    } catch (error: unknown) {
      console.error("❌ Erro no teste:", error);
      setConnectionStatus('offline');

      let errorMessage = "Erro de conexão";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Timeout - Backend demorou muito para responder";
        } else {
          errorMessage = error.message;
        }
      }

      alert(`❌ Backend Offline\n\n${errorMessage}\n\n💡 Sugestão: O backend pode estar hibernando no Replit. Tente acessar a URL diretamente para "acordá-lo":\n\n${BACKEND_BASE_URL}`);
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