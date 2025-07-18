
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

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

      <style>{`
        .report-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          color: #0b74e5;
        }

        .header-content h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .header-content p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .copy-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .copy-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .report-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .response-text {
          flex: 1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          font-size: 1rem;
          line-height: 1.6;
          color: #334155;
          overflow-y: auto;
          max-height: 500px;
        }

        .report-paragraph {
          margin: 0 0 1rem 0;
        }

        .report-paragraph:last-child {
          margin-bottom: 0;
        }

        .report-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .verification-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: #64748b;
        }

        .timestamp {
          font-style: italic;
        }

        @media (max-width: 768px) {
          .report-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .verification-info {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ReportTab;
