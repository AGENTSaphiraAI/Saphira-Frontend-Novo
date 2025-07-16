import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Copy } from 'lucide-react';

interface ReportTabProps {
  interpretedResponse: string;
  verificationCode?: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ interpretedResponse, verificationCode }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(interpretedResponse).then(() => {
      alert('Relatório copiado!');
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} />
          Análise Interpretada da Saphira
        </h4>
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Copy size={14} />
          Copiar Texto
        </button>
      </div>
      <div className="markdown-body" style={{ textAlign: 'left', lineHeight: '1.7' }}>
        <ReactMarkdown>{interpretedResponse || "Gerando relatório..."}</ReactMarkdown>
      </div>
      {verificationCode && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e0e0e0', fontSize: '0.9rem' }}>
          <strong>Código de Verificação:</strong> {verificationCode}
        </div>
      )}
    </div>
  );
};

export default ReportTab;