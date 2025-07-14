import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart3, Code, Download } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
import MetricsTab from './tabs/MetricsTab';
import RawDataTab from './tabs/RawDataTab';
import AboutSaphira from '../AboutSaphira';
import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technical_data?: any;
    verificationCode?: string;
    [key: string]: any;
  };
}

export default function AnalysisDashboard({ response }: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'metrics' | 'raw' | 'about'>('report');

  const handleExportClick = useCallback(() => {
    console.log('🔄 Iniciando exportação PDF...');
    exportSaphiraReportToPdf(response);
  }, [response]);

  return (
    <motion.div 
      className="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            📊 Painel de Análise Saphira
          </h2>
          <p className="dashboard-subtitle">
            Visualização completa dos resultados da análise
          </p>
        </div>

        <motion.button
          className="export-pdf-button"
          onClick={handleExportClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          Exportar PDF
        </motion.button>
      </div>

      {/* Navegação das abas movida para o topo */}
      <div className="tab-navigation-top">
        <button 
          className={activeTab === 'report' ? 'active' : ''}
          onClick={() => setActiveTab('report')}
        >
          <FileText size={16} />
          Relatório
        </button>
        <button 
          className={activeTab === 'metrics' ? 'active' : ''}
          onClick={() => setActiveTab('metrics')}
        >
          <BarChart3 size={16} />
          Métricas
        </button>
        <button 
          className={activeTab === 'raw' ? 'active' : ''}
          onClick={() => setActiveTab('raw')}
        >
          <Code size={16} />
          Dados Brutos
        </button>
        <button 
          className={activeTab === 'about' ? 'active' : ''}
          onClick={() => setActiveTab('about')}
        >
          💙 Sobre a Saphira
        </button>
      </div>

      <div className="dashboard-content">
        <motion.div 
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'report' && <ReportTab response={response} />}
          {activeTab === 'metrics' && <MetricsTab response={response} />}
          {activeTab === 'raw' && <RawDataTab response={response} />}
          {activeTab === 'about' && <AboutSaphira />}
        </motion.div>
      </div>
    </motion.div>
  );
}