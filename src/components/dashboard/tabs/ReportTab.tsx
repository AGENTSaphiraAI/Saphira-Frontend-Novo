import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText, Copy } from 'lucide-react';

interface ReportTabProps {
  interpretedResponse: string;
  verificationCode?: string;
}

// Uma função simples para copiar texto
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Relatório copiado para a área de transferência!');
  }, (err) => {
    console.error('Erro ao copiar texto: ', err);
    alert('Falha ao copiar o relatório.');
  });
};

const ReportTab: React.FC<ReportTabProps> = ({ interpretedResponse, verificationCode }) => {
  return (
    <div className="report-tab" style={{ textAlign: 'left', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} />
          <h3 style={{ margin: 0 }}>Análise Interpretada da Saphira</h3>
        </div>
        <button 
          onClick={() => copyToClipboard(interpretedResponse)}
          className="copy-button"
        >
          <Copy size={16} /> Copiar Texto
        </button>
      </div>

      <div className="markdown-body">
        <ReactMarkdown>{interpretedResponse}</ReactMarkdown>
      </div>

      {verificationCode && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee', fontSize: '0.9rem' }}>
          <strong>Código de Verificação:</strong> <span>{verificationCode}</span>
        </div>
      )}
    </div>
  );
};

export default ReportTab;