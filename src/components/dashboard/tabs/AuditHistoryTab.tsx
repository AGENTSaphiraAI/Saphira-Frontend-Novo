import React from 'react';
import ReactMarkdown from 'react-markdown';

// Este CSS será "scoped" ou adicionado a um arquivo .css global se preferir
const styles = `
.audit-history-tab {
  padding: 1rem;
}
.audit-history-tab h3 {
  color: #3f51b5;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
.history-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}
.history-item-header .timestamp {
  font-weight: bold;
}
.history-item-section {
  margin-top: 1rem;
  color: #333; /* Adicione esta linha para escurecer o texto */
}
.history-item-section strong {
  color: #1a237e;
  display: block;
  margin-bottom: 0.5rem;
}
.content-text {
  color: #1f2937 !important;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}
.detail-label {
  font-weight: 600;
  color: #374151 !important;
}
`;

interface AuditHistoryTabProps {
  history: any[];
}

const AuditHistoryTab: React.FC<AuditHistoryTabProps> = ({ history }) => {
  return (
    <div className="audit-history-tab">
      <style>{styles}</style> {/* Aplica os estilos */}
      <h3>Histórico de Auditoria</h3>
      {history.length > 0 ? (
        history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="history-item-header">
              <span className="timestamp">Realizada em: {new Date(item.timestamp).toLocaleString()}</span>
            </div>

            <div className="history-item-section">
              <strong>Entrada:</strong>
              <p>{item.originalText}</p>
            </div>

            <div className="history-item-section">
              <strong>Resposta Principal:</strong>
              <ReactMarkdown>{item.displayData?.humanized_text || item.humanized_text || 'Resposta não disponível'}</ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <p>O histórico de análises está vazio.</p>
      )}
    </div>
  );
};

export default AuditHistoryTab;