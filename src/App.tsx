import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('💙 Olá! Sou a Saphira. Como posso ajudar você hoje?');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [humanizedResponse, setHumanizedResponse] = useState('');
  const [technicalData, setTechnicalData] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'https://saphira-engine-guilhermegnarci.replit.app';

  const handleAnalyze = async () => {
    // Priorizar anexo se existir, senão usar texto manual
    const finalText = uploadedFile ? await readFileContent(uploadedFile) : text.trim();

    // ✅ Permitir pergunta isolada (sem texto ou anexo)
    if (!finalText && !question.trim()) {
      setResult('💙 Para uma análise, você pode:\n\n🔹 Fazer uma pergunta direta\n🔹 Enviar texto para análise\n🔹 Anexar um arquivo\n🔹 Combinar pergunta + conteúdo\n\nEstou aqui para ajudar! 😊');
      setStatus('⚠️ Informe pelo menos uma pergunta ou conteúdo para análise');
      return;
    }

    setIsLoading(true);
    setStatus('🤖 Analisando... A Saphira está trabalhando para você!');
    setResult('');
    setHumanizedResponse('');

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: finalText,
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisData(data);

      if (data?.interpreted_response) {
        setResult(data.interpreted_response);
        setHumanizedResponse(data.interpreted_response);
        setStatus('✨ Análise concluída! Confira a resposta da Saphira abaixo.');
      } else if (data?.synthesis?.summary) {
        setResult(data.synthesis.summary);
        setHumanizedResponse(data.synthesis.summary);
        setStatus('✨ Análise concluída! Resumo disponível.');
      } else {
        const fallbackMessage = '💙 Análise processada! Embora não tenha uma resposta detalhada específica, os dados foram analisados com sucesso.';
        setResult(fallbackMessage);
        setHumanizedResponse(fallbackMessage);
        setStatus('✨ Análise processada.');
      }

      // Processar dados técnicos
      const technicalSummary = data?.technical_summary || 
        data?.synthesis?.technical_analysis ||
        `✅ Tom: ${data?.analysis?.tone || 'neutro'}\n⚖️ Viés: ${data?.analysis?.bias || 'nenhum detectado'}\n🔍 Contradições: ${data?.analysis?.contradictions || 'não detectadas'}\n💡 Sugestão: análise concluída com sucesso!`;
      
      setTechnicalData(technicalSummary);
    } catch (error) {
      console.error('Erro:', error);
      setResult(`🚨 Ops! Não consegui me conectar ao backend.\n\nPor favor, verifique se o sistema está funcionando.\n\nTente novamente em alguns instantes.`);
      setStatus('⚠️ Erro de conexão - Tente novamente');
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (file.name.toLowerCase().endsWith('.json')) {
            const jsonData = JSON.parse(content);
            let extractedText = '';
            if (jsonData.text) extractedText = jsonData.text;
            else if (jsonData.content) extractedText = jsonData.content;
            else if (jsonData.message) extractedText = jsonData.message;
            else if (jsonData.description) extractedText = jsonData.description;
            else if (typeof jsonData === 'string') extractedText = jsonData;
            else extractedText = JSON.stringify(jsonData, null, 2);
            resolve(extractedText);
          } else {
            resolve(content);
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.toLowerCase().split('.').pop();

    if (!['txt', 'json', 'pdf', 'doc', 'docx'].includes(fileExtension || '')) {
      setResult('⚠️ Arquivo não suportado. Use: .txt, .json, .pdf, .doc ou .docx');
      setStatus('Formato não suportado');
      return;
    }

    if (['pdf', 'doc', 'docx'].includes(fileExtension || '')) {
      setResult('📄 Arquivo PDF/DOC detectado! Suporte completo em breve.');
      setStatus('⚠️ PDF/DOC: Upload ok, processamento em desenvolvimento');
    }

    setUploadedFile(file);
    setStatus(`📁 Arquivo "${file.name}" carregado com sucesso!`);
    setResult('');
    event.target.value = '';
  };

  const handleClear = () => {
    setText('');
    setQuestion('');
    setResult('');
    setAnalysisData(null);
    setHumanizedResponse('');
    setTechnicalData('');
    setUploadedFile(null);
    setStatus('💙 Campos limpos! Pronta para uma nova análise.');
  };

  const exportTXT = () => {
    if (!humanizedResponse) {
      alert('Nenhuma resposta disponível para exportar');
      return;
    }

    const blob = new Blob([humanizedResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saphira-resposta.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!analysisData) {
      alert('Nenhuma análise disponível para exportar');
      return;
    }

    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saphira-analise-completa.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      <div className="main-card">
        {/* Header */}
        <div className="header">
          <h1 className="title">💙 Saphira</h1>
          <p className="subtitle">Análise Inteligente</p>
          <div className="status-card">
            <p className="status-text">{status}</p>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <div className="input-group">
            <label className="input-label">Pergunta ou Texto para Análise</label>
            <textarea
              className="text-area"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Digite sua pergunta ou cole o texto que deseja analisar..."
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Pergunta Específica (Opcional)</label>
            <input
              type="text"
              className="question-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Faça uma pergunta específica sobre o conteúdo..."
              disabled={isLoading}
            />
          </div>

          {/* File Upload */}
          <div className="file-section">
            <label className="file-upload-btn">
              📎 Anexar Arquivo
              <input
                type="file"
                accept=".txt,.json,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            {uploadedFile && (
              <div className="file-attached">
                <span>📄 {uploadedFile.name}</span>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="remove-file-btn"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? '⏳ Analisando...' : '🔍 Analisar'}
          </button>

          <button 
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            🧹 Limpar
          </button>
        </div>

        {/* Card Humanizado */}
        {humanizedResponse && (
          <div className="result-section">
            <div className="card-humanized">
              <h3 className="result-title">💙 Resposta da Saphira</h3>
              <div className="result-content">
                {humanizedResponse}
              </div>
            </div>
          </div>
        )}

        {/* Card Técnico */}
        {technicalData && (
          <div className="technical-section">
            <div className="card-technical">
              <h4 className="technical-title">🛠️ Dados Técnicos</h4>
              <pre className="technical-content">
                {technicalData}
              </pre>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {(humanizedResponse || analysisData) && (
          <div className="export-section">
            <div className="export-buttons">
              {humanizedResponse && (
                <button 
                  onClick={exportTXT}
                  className="btn btn-export"
                >
                  📄 Exportar TXT
                </button>
              )}

              {analysisData && (
                <button 
                  onClick={exportJSON}
                  className="btn btn-export"
                >
                  🔧 Exportar JSON
                </button>
              )}
            </div>
          </div>
        )}

        {/* Future Cards Area */}
        <div className="future-cards">
          <div className="placeholder-card">
            <p>📊 Área reservada para módulos futuros (Nexum, ScanCross)</p>
          </div>
        </div>
      </div>
    </div>
  );
}