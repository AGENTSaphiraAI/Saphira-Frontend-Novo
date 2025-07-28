import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
import StatusBadge from './StatusBadge';
import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technical_data?: any;
    verificationCode?: string;
    [key: string]: any;
  };
  handleExportResponseJSON?: () => void;
  handleExportDocx?: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response, handleExportResponseJSON, handleExportDocx }) => {
  const [isExporting, setIsExporting] = useState(false);

  const activeTab = 'report'; // Mantendo a simplicidade por enquanto

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportSaphiraReportToPdf(response);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('❌ Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- LÓGICA DE MAPEAMENTO CORRIGIDA ---
  // Extrai e calcula os valores para os Badges com base no que o backend REALMENTE envia.
  const technicalData = response.technical_data || {};
  const voiceMode = technicalData.tom?.tipo || 'N/A';
  const overallRisk = (technicalData.vies?.detectado || technicalData.contradicoes?.detectada) ? 'Risco Detectado' : 'Baixo Risco';
  const confidenceScores = [
    technicalData.tom?.confianca || 0,
    technicalData.vies?.confianca || 0,
    technicalData.contradicoes?.confianca || 0
  ].filter(score => score > 0);
  const avgConfidence = confidenceScores.length > 0 
    ? (confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length * 100).toFixed(0) + '%'
    : '0%';
  // --- FIM DA LÓGICA DE MAPEAMENTO ---

  return (
    <motion.div 
      className="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <div className="header-info">
          <h2>📊 Dashboard de Análise Saphira</h2>
          <p>Análise completa com visualizações interativas</p>
          {response.verificationCode && (
            <span className="verification-code">
              🔍 Código: {response.verificationCode}
            </span>
          )}
        </div>

        <div className="dashboard-export-buttons">
          <button className="export-button json" onClick={handleExportResponseJSON}>
            <Download size={18} /> JSON
          </button>
          <button className="export-button doc" onClick={handleExportDocx}>
            <Download size={18} /> DOC
          </button>
          <button className="export-button pdf" onClick={handleExportPdf} disabled={isExporting}>
            <Download size={18} /> {isExporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>

      <div className="status-header">
        {/* Usando as variáveis corrigidas */}
        <StatusBadge icon="🎤" label="Modo de Voz" value={voiceMode} />
        <StatusBadge icon="🛡️" label="Risco Geral" value={overallRisk} />
        <StatusBadge icon="🎯" label="Confiança" value={avgConfidence} />
      </div>

      <div className="dashboard-content">
        <ReportTab 
          interpretedResponse={response.humanized_text || 'Resposta não disponível'}
          verificationCode={response.verificationCode}
        />
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;