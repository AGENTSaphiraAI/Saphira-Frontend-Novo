
import React from 'react';

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicalData: any;
}

const TechnicalModal: React.FC<TechnicalModalProps> = ({ isOpen, onClose, technicalData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content technical-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔬 Análise Técnica Detalhada</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Radar Chart Placeholder */}
          <div className="radar-chart-section">
            <h3>📊 Gráfico de Radar</h3>
            <div className="chart-placeholder">
              <p>🔜 Gráfico de Radar será implementado na Fase 2</p>
              <div className="mock-radar">
                <div className="radar-center">Análise</div>
                <div className="radar-axes">
                  <span>Tom</span>
                  <span>Viés</span>
                  <span>Contradições</span>
                  <span>Clareza</span>
                </div>
              </div>
            </div>
          </div>

          {/* JSON Viewer */}
          <div className="json-viewer-section">
            <h3>🧾 Dados Técnicos (JSON)</h3>
            <div className="json-viewer">
              <pre className="json-content">
                {JSON.stringify(technicalData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Technical Summary */}
          <div className="technical-summary">
            <h3>📋 Resumo Técnico</h3>
            <div className="tech-metrics">
              {technicalData?.tom && (
                <div className="metric-card">
                  <h4>🎭 Tom</h4>
                  <p>{technicalData.tom.tipo} ({Math.round(technicalData.tom.confianca * 100)}%)</p>
                </div>
              )}
              {technicalData?.vies && (
                <div className="metric-card">
                  <h4>⚖️ Viés</h4>
                  <p>{technicalData.vies.detectado ? "Detectado" : "Não detectado"}</p>
                </div>
              )}
              {technicalData?.contradicoes && (
                <div className="metric-card">
                  <h4>🔄 Contradições</h4>
                  <p>{technicalData.contradicoes.detectada ? "Detectadas" : "Nenhuma"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalModal;
