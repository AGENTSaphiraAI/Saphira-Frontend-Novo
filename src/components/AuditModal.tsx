import React from 'react';
import ReactMarkdown from 'react-markdown';
import './AuditModal.css';

// Estrutura de dados que o modal espera receber
interface AuditEntry {
  id: string;
  timestamp: string;
  originalText: string;
  displayData: {
    humanized_text: string;
    expert_analysis?: string;
  };
  verification_code: string;
}

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditEntry[];
}

const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Auditoria de Rastreabilidade</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="history-list">
          {history.length > 0 ? (
            history.map((item) => (
              <div key={item.id} className="log-item">
                <div className="log-item-header">
                  <strong>Código de Verificação:</strong> 
                  <span className="verification-code">{item.verification_code}</span>
                  <span className="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
                </div>

                <div className="log-section">
                  <h4>Entrada Original:</h4>
                  <p className="original-text">{item.originalText}</p>
                </div>

                <div className="log-section">
                  <h4>Resposta Principal:</h4>
                  <ReactMarkdown>{item.displayData.humanized_text}</ReactMarkdown>
                </div>

                {/* Exibe a Análise Profunda apenas se ela existir */}
                {item.displayData.expert_analysis && (
                  <div className="log-section expert-analysis">
                    <h4>Análise Profunda (Modo Expert):</h4>
                    <ReactMarkdown>{item.displayData.expert_analysis}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>Nenhuma análise no histórico.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;