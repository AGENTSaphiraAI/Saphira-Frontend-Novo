
import React, { useState } from "react";
import "./App.css";
import Modal from "./components/ModalSobre";

function App() {
  const [inputText, setInputText] = useState("");
  const [question, setQuestion] = useState("");
  const [showExport, setShowExport] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = () => {
    if (inputText.trim()) {
      console.log("Analisando localmente...");
      setShowExport(true);
    } else {
      alert("Por favor, insira um texto para analisar.");
    }
  };

  const handleClear = () => {
    setInputText("");
    setQuestion("");
    setShowExport(false);
  };

  const handleTestConnection = () => {
    alert("Teste de conexão simulado (frontend local).");
  };

  const handleSobre = () => {
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-2 text-white flex justify-center items-center gap-2">
        <span>💙</span> Saphira
      </h1>
      <p className="text-white mb-6">Análise Inteligente, Técnica e Auditável</p>

      <textarea
        className="w-full p-3 rounded mb-3 resize-none"
        rows={4}
        placeholder="Digite um artigo para verificar contradições e viés..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <input
        className="w-full p-2 rounded mb-3"
        type="text"
        placeholder="Pergunta Específica (Opcional)"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="mb-4">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded mb-2">
          Selecionar Arquivo (.txt, em breve .doc)
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button onClick={handleAnalyze} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Analisar
        </button>
        <button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Limpar
        </button>
        <button onClick={handleTestConnection} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Testar Conexão
        </button>
        <button onClick={handleSobre} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
          Sobre a Saphira
        </button>
      </div>

      {showExport && (
        <div className="mb-4">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
            Exportar JSON
          </button>
        </div>
      )}

      <p className="text-white text-sm mb-4">
        🔒 Saphira • Plataforma de Análise Premium • Auditável • Transparente
        <br />
        🔎 Privacidade Total • Análise Técnica • Resultados Verificáveis
      </p>

      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
