import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
import AuditHistoryTab from './tabs/AuditHistoryTab';
import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technical_data?: any;
    verificationCode?: string;
    [key: string]: any;
  };
  history: any[];
  handleExportResponseJSON?: () => void;
  handleExportDocx?: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response, history, handleExportResponseJSON, handleExportDocx }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'metrics' | 'raw' | 'history'>('report');
  const [isExporting, setIsExporting] = useState(false);

  const tabs = [
    {
      id: 'report' as const,
      label: 'Relatório Principal',
      icon: FileText,
      description: 'Resposta interpretada da Saphira'
    },
    {
      id: 'history' as const,
      label: 'Histórico de Auditoria',
      icon: Clock,
      description: `${history?.length || 0} análise${(history?.length || 0) !== 1 ? 's' : ''} registrada${(history?.length || 0) !== 1 ? 's' : ''}`
    }
  ];

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

      {/* Navegação das Abas */}
      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={20} />
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Conteúdo das Abas */}
      <motion.div 
        className="dashboard-content"
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'report' && (
          <ReportTab 
            interpretedResponse={response.humanized_text || 'Resposta não disponível'}
            verificationCode={response.verificationCode}
          />
        )}
        {activeTab === 'history' && (
          <AuditHistoryTab history={history} />
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalysisDashboard;