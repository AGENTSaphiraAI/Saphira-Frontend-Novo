
import React, { useEffect } from 'react';
interface TechnicalData {
  tone?: number;
  bias?: number;
  clarity?: number;
  consistency?: number;
  contradiction?: number;
  tom?: { tipo: string; confianca: number };
  vies?: { detectado: boolean; confianca: number };
  contradicoes?: { detectada: boolean; confianca: number };
  sugestao?: string;
  [key: string]: any;
}

interface TechnicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  technicalData: TechnicalData | null;
}

const TechnicalModal: React.FC<TechnicalModalProps> = ({ isOpen, onClose, technicalData }) => {
  // Hook para fechar o modal com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Mapeamento dos dados para métricas visuais
  const getMetricValue = (data: TechnicalData | null, key: string): number => {
    if (!data) return 0;
    
    // Conversão inteligente dos dados Saphira para percentuais
    switch (key) {
      case 'tone':
        return data.tom?.confianca || data.tone || 0;
      case 'bias':
        return data.vies?.confianca || data.bias || 0;
      case 'contradiction':
        return data.contradicoes?.confianca || data.contradiction || 0;
      case 'clarity':
        return data.clarity || Math.random() * 100; // Mock para demonstração
      case 'consistency':
        return data.consistency || Math.random() * 100; // Mock para demonstração
      default:
        return 0;
    }
  };

  

  const formatJsonForDisplay = (data: any) => {
    if (!data) return { message: "Nenhum dado técnico disponível" };
    
    return {
      timestamp: new Date().toISOString(),
      analysis: {
        tom: data.tom || { tipo: "neutro", confianca: 0 },
        vies: data.vies || { detectado: false, confianca: 0 },
        contradicoes: data.contradicoes || { detectada: false, confianca: 0 },
        sugestao: data.sugestao || "Análise em processamento"
      },
      metrics: {
        tone_score: getMetricValue(data, 'tone'),
        bias_score: getMetricValue(data, 'bias'),
        contradiction_score: getMetricValue(data, 'contradiction'),
        clarity_score: getMetricValue(data, 'clarity'),
        consistency_score: getMetricValue(data, 'consistency')
      },
      raw_data: data
    };
  };

  return (
    <div className="audit-modal-overlay" onClick={onClose}>
      <div className="audit-modal technical-modal" onClick={(e) => e.stopPropagation()}>
        <div className="audit-modal-header">
          <h2>🔬 Análise Técnica Detalhada</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Seção do Gráfico Radar */}
          <div className="radar-chart-section">
            <h3>📊 Mapa de Performance</h3>
            <div className="chart-placeholder">
              <div className="mock-radar">
                <div className="radar-center">Saphira</div>
              </div>
              <div className="radar-axes">
                <span>Tom: {getMetricValue(technicalData, 'tone').toFixed(1)}%</span>
                <span>Viés: {getMetricValue(technicalData, 'bias').toFixed(1)}%</span>
                <span>Contradições: {getMetricValue(technicalData, 'contradiction').toFixed(1)}%</span>
                <span>Clareza: {getMetricValue(technicalData, 'clarity').toFixed(1)}%</span>
              </div>
              <p style={{ color: 'var(--saphira-accent)', marginTop: '1rem' }}>
                📈 Gráfico interativo será implementado na próxima atualização
              </p>
            </div>
          </div>

          {/* Métricas Resumidas */}
          <div className="technical-summary">
            <h3>📋 Resumo Executivo</h3>
            <div className="tech-metrics">
              <div className="metric-card">
                <h4>Tom Detectado</h4>
                <p>{technicalData?.tom?.tipo || 'Neutro'}</p>
              </div>
              <div className="metric-card">
                <h4>Viés Presente</h4>
                <p>{technicalData?.vies?.detectado ? 'Sim' : 'Não'}</p>
              </div>
              <div className="metric-card">
                <h4>Contradições</h4>
                <p>{technicalData?.contradicoes?.detectada ? 'Detectadas' : 'Não detectadas'}</p>
              </div>
              <div className="metric-card">
                <h4>Confiança Média</h4>
                <p>{((getMetricValue(technicalData, 'tone') + getMetricValue(technicalData, 'bias') + getMetricValue(technicalData, 'contradiction')) / 3).toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Visualizador JSON */}
          <div className="json-viewer-section">
            <h3>🔍 Dados Técnicos Completos</h3>
            <div className="json-viewer">
              <pre className="json-content">
                {JSON.stringify(formatJsonForDisplay(technicalData), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalModal;
