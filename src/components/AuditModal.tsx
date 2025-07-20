const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose, history = [], onExportLogs }) => {
  if (!isOpen) return null;

  // Garante que history é sempre um array
  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title">Histórico de Auditoria</span>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="logs-summary">
            <span className="logs-count">
              {safeHistory.length} {safeHistory.length === 1 ? 'entrada' : 'entradas'} registradas
            </span>
            <button 
              className="export-logs-button"
              onClick={onExportLogs}
              disabled={safeHistory.length === 0}
            >
              Exportar Logs
            </button>
          </div>

          <div className="audit-logs">
            {safeHistory.length === 0 ? (
              <div className="no-logs">
                <p>📝 Nenhum histórico de auditoria disponível ainda.</p>
                <p>Realize algumas análises para ver o histórico aqui.</p>
              </div>
            ) : (
              safeHistory.map((entry) => (
                <div className="log-entry" key={entry.timestamp}>
                  <div className="log-details">
                    <span className="log-timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
                    <span className="log-event">{entry.event}</span>
                  </div>
                  <div className="log-user">
                    <span>Usuário: {entry.user}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};