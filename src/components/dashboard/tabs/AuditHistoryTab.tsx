
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AuditHistoryTabProps {
  history: any[];
}

const AuditHistoryTab: React.FC<AuditHistoryTabProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <motion.div 
        className="audit-history-tab"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="history-header">
          <Clock className="header-icon" size={24} />
          <div>
            <h3>Histórico de Auditoria</h3>
            <p>Nenhuma análise realizada ainda</p>
          </div>
        </div>
        
        <div className="empty-history">
          <FileText size={48} />
          <p>Realize uma análise para ver o histórico aqui</p>
        </div>

        <style>{`
          .audit-history-tab {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .history-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .header-icon {
            color: #0b74e5;
          }

          .history-header h3 {
            margin: 0;
            color: #1e293b;
            font-size: 1.2rem;
            font-weight: 600;
          }

          .history-header p {
            margin: 0;
            color: #64748b;
            font-size: 0.9rem;
          }

          .empty-history {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            color: #64748b;
            text-align: center;
          }

          .empty-history svg {
            margin-bottom: 1rem;
            opacity: 0.5;
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="audit-history-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="history-header">
        <Clock className="header-icon" size={24} />
        <div>
          <h3>Histórico de Auditoria</h3>
          <p>{history.length} análise{history.length !== 1 ? 's' : ''} registrada{history.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="history-list">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            className="history-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="item-header">
              <span className="timestamp">
                📅 {new Date(item.timestamp).toLocaleString('pt-BR')}
              </span>
              {item.verificationCode && (
                <span className="verification-code">
                  🔍 {item.verificationCode}
                </span>
              )}
            </div>
            
            <div className="original-text">
              <strong>📄 Texto Original:</strong>
              <p>{item.originalText?.substring(0, 200)}{item.originalText?.length > 200 ? '...' : ''}</p>
            </div>
            
            <div className="response-content">
              <strong>🤖 Resposta Saphira:</strong>
              <div className="markdown-content">
                <ReactMarkdown>{item.displayData?.humanized_text || item.humanized_text || 'Resposta não disponível'}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .audit-history-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .history-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-icon {
          color: #0b74e5;
        }

        .history-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .history-header p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .history-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .history-item:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .timestamp {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .verification-code {
          background: linear-gradient(45deg, #0b74e5, #1d4ed8);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .original-text {
          margin-bottom: 1.5rem;
        }

        .original-text strong {
          color: #1e293b;
          display: block;
          margin-bottom: 0.5rem;
        }

        .original-text p {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          margin: 0;
          font-size: 0.9rem;
          color: #475569;
          border-left: 4px solid #0b74e5;
        }

        .response-content strong {
          color: #1e293b;
          display: block;
          margin-bottom: 0.5rem;
        }

        .markdown-content {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          color: #1e293b;
          margin-top: 0;
        }

        .markdown-content p {
          margin: 0.5rem 0;
          color: #475569;
          line-height: 1.6;
        }

        .markdown-content ul,
        .markdown-content ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content li {
          margin: 0.25rem 0;
          color: #475569;
        }

        .markdown-content code {
          background: #e2e8f0;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .markdown-content blockquote {
          border-left: 4px solid #0b74e5;
          margin: 1rem 0;
          padding-left: 1rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .item-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .history-item {
            padding: 1rem;
          }
          
          .original-text p,
          .markdown-content {
            padding: 0.75rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AuditHistoryTab;
