import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ReportTabProps {
  interpretedResponse: string;
  verificationCode?: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ interpretedResponse, verificationCode }) => {

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(interpretedResponse).then(() => {
      alert('Relatório copiado para a área de transferência!');
    }, (err) => {
      console.error('Erro ao copiar: ', err);
      alert('Falha ao copiar o relatório.');
    });
  };

  return (
    <div style={{ textAlign: 'left', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>📄 Análise Interpretada da Saphira</h3>
        <button onClick={handleCopyToClipboard}>📋 Copiar Texto</button>
      </div>

      <div className="markdown-body">
        <ReactMarkdown>{interpretedResponse}</ReactMarkdown>
      </div>

      {verificationCode && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          <strong>Código de Verificação:</strong> {verificationCode}
        </div>
      )}
    </div>
  );
};

export default ReportTab;