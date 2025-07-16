import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileText } from 'lucide-react';

interface ReportTabProps {
  interpretedResponse: string;
  verificationCode?: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ interpretedResponse, verificationCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(interpretedResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('❌ Erro ao copiar texto');
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} className="report-paragraph">
        {line}
      </p>
    ));
  };

  return (
    <motion.div 
      className="report-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="report-header">
        <div className="header-content">
          <FileText className="header-icon" size={24} />
          <div>
            <h3>Análise Interpretada da Saphira</h3>
            <p>Resposta humanizada e contextualizada</p>
          </div>
        </div>
        
        <button 
          className="copy-button"
          onClick={handleCopy}
          disabled={copied}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
          {copied ? 'Copiado!' : 'Copiar Texto'}
        </button>
      </div>

      <div className="report-content">
        <div className="response-text">
          {formatText(interpretedResponse)}
        </div>
        
        {verificationCode && (
          <div className="report-footer">
            <div className="verification-info">
              <span>🔍 Código de Verificação: <strong>{verificationCode}</strong></span>
              <span className="timestamp">📅 {new Date().toLocaleString('pt-BR')}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ReportTab;