import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
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

  // Simplificado para mostrar apenas o relatório principal
  const activeTab = 'report';

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

  return (
    <motion.div 
      className="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cabeçalho do Dashboard */}
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
          {handleExportResponseJSON && (
            <button 
              className="export-pdf-button"
              onClick={handleExportResponseJSON}
              style={{
                background: 'linear-gradient(45deg, #4caf50 0%, #66bb6a 100%)',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
              }}
            >
              <Download size={20} />
              <span>Exportar JSON</span>
            </button>
          )}

          <button 
              className="export-pdf-button"
              onClick={handleExportDocx}
              disabled={!handleExportDocx}
            >
              <Download size={20} />
              <span>Exportar DOC</span>
            </button>

          <button 
            className="export-pdf-button"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <Download size={20} />
            <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal - Relatório da Saphira */}
      <motion.div 
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ReportTab 
          interpretedResponse={response.humanized_text || 'Resposta não disponível'}
          verificationCode={response.verificationCode}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnalysisDashboard;