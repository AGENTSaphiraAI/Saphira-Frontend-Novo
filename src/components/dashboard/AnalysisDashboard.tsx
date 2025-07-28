
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, Braces } from 'lucide-react';

import ReportTab from './tabs/ReportTab';
import MetricsTab from './tabs/MetricsTab';
import StatusBadge from './StatusBadge';

import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technical_data?: any;
    verificationCode?: string;
  };
  handleExportResponseJSON: () => void;
  handleExportDocx: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response, handleExportResponseJSON, handleExportDocx }) => {
  const [isExporting, setIsExporting] = useState(false);
  // Reativando o estado para controlar as abas
  const [activeTab, setActiveTab] = useState<'report' | 'metrics' | 'data'>('report');

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
      
      {/* O cabeçalho de status que já existia, agora funcionando */}
      <div className="status-header">
        <StatusBadge 
          icon="🎤" 
          label="Modo de Voz" 
          value={response.technical_data?.voice_calibration?.voice_mode || 'N/A'} 
        />
        <StatusBadge 
          icon="🛡️" 
          label="Risco Geral" 
          value={response.technical_data?.forensic_analysis?.overall_manipulation_risk || 'N/A'} 
        />
        <StatusBadge 
          icon="🎯" 
          label="Confiança" 
          value={`${((response.technical_data?.confidence_level?.score || 0) * 100).toFixed(0)}%`} 
        />
      </div>

      {/* Navegação das Abas */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <FileText size={20} />
          <div className="tab-content">
            <span className="tab-label">Relatório Principal</span>
            <span className="tab-description">Análise interpretada e humanizada</span>
          </div>
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          <BarChart3 size={20} />
          <div className="tab-content">
            <span className="tab-label">Métricas Visuais</span>
            <span className="tab-description">Gráficos e indicadores técnicos</span>
          </div>
        </button>
        
        <button 
          className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          <Braces size={20} />
          <div className="tab-content">
            <span className="tab-label">Dados Brutos</span>
            <span className="tab-description">JSON técnico completo</span>
          </div>
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <motion.div 
        className="dashboard-content"
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'report' && (
          <ReportTab 
            interpretedResponse={response.humanized_text || 'Resposta não disponível'}
            verificationCode={response.verificationCode}
          />
        )}
        {activeTab === 'metrics' && (
          <MetricsTab technicalData={response.technical_data} />
        )}
        {activeTab === 'data' && (
          <div className="raw-data-tab">
            <div className="raw-data-header">
              <Braces className="header-icon" size={24} />
              <div>
                <h3>Dados Técnicos Brutos</h3>
                <p>JSON completo retornado pela API</p>
              </div>
            </div>
            <div className="json-container">
              <pre className="json-content">
                {JSON.stringify(response.technical_data || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnalysisDashboard;
