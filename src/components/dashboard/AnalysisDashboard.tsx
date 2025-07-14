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

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response }) => {
  const [activeMainTab, setActiveMainTab] = useState<'analise' | 'sobre'>('analise');
  const [activeTab, setActiveTab] = useState<'report' | 'metrics' | 'raw'>('report');
  const [isExporting, setIsExporting] = useState(false);

  const tabs = [
    {
      id: 'report' as const,
      label: 'Relatório Principal',
      icon: FileText,
      description: 'Resposta interpretada da Saphira'
    },
    {
      id: 'metrics' as const,
      label: 'Métricas Visuais',
      icon: BarChart3,
      description: 'Análise técnica em gráficos'
    },
    {
      id: 'raw' as const,
      label: 'Dados Técnicos',
      icon: Code,
      description: 'JSON completo da análise'
    }
  ];

  const handleExportPdf = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportSaphiraReportToPdf(response);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('❌ Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }, [response]);

  return (
    <div className="dashboard-container">
      {/* Nova seção de navegação principal */}
      <div className="tab-navigation">
        <button 
          onClick={() => setActiveMainTab('analise')} 
          className={activeMainTab === 'analise' ? 'active' : ''}
        >
          Análise de Dados
        </button>
        <button 
          onClick={() => setActiveMainTab('sobre')} 
          className={activeMainTab === 'sobre' ? 'active' : ''}
        >
          Sobre a Saphira
        </button>
      </div>

      {/* Nova seção de conteúdo das abas */}
      <div className="tab-content">
        {activeMainTab === 'analise' ? (
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

              <button 
                className="export-pdf-button"
                onClick={handleExportPdf}
                disabled={isExporting}
              >
                <Download size={20} />
                {isExporting ? 'Exportando...' : 'Exportar PDF'}
              </button>
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
              {activeTab === 'metrics' && (
                <MetricsTab technicalData={response.technical_data || response} />
              )}
              {activeTab === 'raw' && (
                <RawDataTab technicalData={response.technical_data || response} />
              )}
            </motion.div>
          </motion.div>
        ) : (
          <AboutSaphira />
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;