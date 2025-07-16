import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Copy, Check, FileText } from 'lucide-react';

interface ReportTabProps {
  interpretedResponse: string;
  verificationCode?: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ 
  interpretedResponse, 
  verificationCode 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(interpretedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <motion.div 
      className="report-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <div className="report-title">
          <FileText className="report-icon" />
          <h3>Relatório de Análise</h3>
        </div>

        <div className="report-actions">
          {verificationCode && (
            <div className="verification-badge">
              <span className="verification-label">Código:</span>
              <code className="verification-code">{verificationCode}</code>
            </div>
          )}

          <button 
            className="copy-button"
            onClick={handleCopyReport}
            title="Copiar relatório"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="report-content markdown-body">
        <ReactMarkdown>{interpretedResponse}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

export default ReportTab;