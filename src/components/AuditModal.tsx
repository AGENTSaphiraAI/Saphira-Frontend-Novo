
import React from "react";

interface AuditEntry {
  id: string;
  timestamp: Date;
  originalText: string;
  fileName?: string;
  response: string;
  verificationCode: string;
}

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditEntry[];
  onExportLogs: () => void;
}

function AuditModal({ isOpen, onClose, auditLogs, onExportLogs }: AuditModalProps) {
  if (!isOpen) return null;

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="audit-modal-overlay" onClick={onClose}>
      <div className="audit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="audit-modal-header">
          <h2>🛡️ Auditoria de Rastreabilidade</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="audit-modal-content">
          <div className="audit-controls">
            <button 
              className="export-logs-button"
              onClick={onExportLogs}
              disabled={auditLogs.length === 0}
            >
              📥 Exportar Logs (JSON)
            </button>
            <span className="logs-count">
              {auditLogs.length} análise(s) registrada(s)
            </span>
          </div>

          <div className="audit-logs">
            {auditLogs.length === 0 ? (
              <div className="no-logs">
                📝 Nenhuma análise registrada ainda
              </div>
            ) : (
              auditLogs.map((entry) => (
                <div key={entry.id} className="audit-entry">
                  <div className="audit-entry-header">
                    <div className="entry-timestamp">
                      🕒 {formatTimestamp(entry.timestamp)}
                    </div>
                    <div className="verification-code">
                      Código de verificação: <code>{entry.verificationCode}</code>
                    </div>
                  </div>
                  
                  <div className="audit-entry-content">
                    <div className="original-content">
                      <h4>📄 Entrada:</h4>
                      {entry.fileName && (
                        <div className="file-info">
                          📁 Arquivo: <strong>{entry.fileName}</strong>
                        </div>
                      )}
                      <div className="content-preview">
                        {entry.originalText.length > 200 
                          ? entry.originalText.substring(0, 200) + "..."
                          : entry.originalText
                        }
                      </div>
                    </div>
                    
                    <div className="response-content">
                      <h4>💬 Resposta:</h4>
                      <div className="content-preview">
                        {entry.response.length > 200 
                          ? entry.response.substring(0, 200) + "..."
                          : entry.response
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditModal;
