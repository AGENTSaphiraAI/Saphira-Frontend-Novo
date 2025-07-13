
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
import MetricsTab from './tabs/MetricsTab';
import RawDataTab from './tabs/RawDataTab';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: any;
  onBackToInput: () => void;
}

type TabType = 'report' | 'metrics' | 'rawdata';

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response, onBackToInput }) => {
  const [activeTab, setActiveTab] = useState<TabType>('report');

  // Calcular pontuação de integridade
  const calculateIntegrityScore = () => {
    const technicalData = response.technicalData || response.displayData?.technicalData;
    if (!technicalData) return 0.5;

    let score = 0;
    let count = 0;

    if (technicalData.tom?.confianca) {
      score += technicalData.tom.confianca;
      count++;
    }
    if (technicalData.vies?.confianca) {
      score += technicalData.vies.confianca;
      count++;
    }
    if (technicalData.contradicoes?.confianca) {
      score += technicalData.contradicoes.confianca;
      count++;
    }

    return count > 0 ? score / count : 0.75;
  };

  const integrityScore = calculateIntegrityScore();
  
  const getIntegrityColor = (score: number) => {
    if (score >= 0.8) return '#10b981'; // Verde
    if (score >= 0.6) return '#f59e0b'; // Amarelo
    return '#ef4444'; // Vermelho
  };

  const getIntegrityIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle size={24} />;
    if (score >= 0.6) return <AlertTriangle size={24} />;
    return <XCircle size={24} />;
  };

  const getDiagnosticCore = () => {
    const interpretedResponse = response.interpreted_response || 
                               response.displayData?.humanized_text || 
                               "Análise concluída com sucesso";
    
    // Extrair primeira frase ou primeiros 100 caracteres
    const firstSentence = interpretedResponse.split('.')[0] + '.';
    return firstSentence.length > 120 ? 
           interpretedResponse.substring(0, 120) + '...' : 
           firstSentence;
  };

  const tabs = [
    { id: 'report', label: '📄 Relatório', icon: '📄' },
    { id: 'metrics', label: '📊 Métricas Visuais', icon: '📊' },
    { id: 'rawdata', label: '💾 Dados Brutos', icon: '💾' }
  ];

  return (
    <motion.div 
      className="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header com Selo de Integridade */}
      <div className="dashboard-header">
        <button 
          className="back-button"
          onClick={onBackToInput}
          title="Voltar ao painel de entrada"
        >
          <ArrowLeft size={20} />
          <span>Nova Análise</span>
        </button>

        <div className="integrity-section">
          <div 
            className="integrity-seal"
            style={{ 
              borderColor: getIntegrityColor(integrityScore),
              color: getIntegrityColor(integrityScore)
            }}
          >
            <Shield size={32} />
            <div className="seal-text">
              <span className="seal-title">Selo Saphira</span>
              <span className="seal-score">{Math.round(integrityScore * 100)}% Integridade</span>
            </div>
          </div>

          <div className="core-diagnostic">
            <div className="diagnostic-icon" style={{ color: getIntegrityColor(integrityScore) }}>
              {getIntegrityIcon(integrityScore)}
            </div>
            <div className="diagnostic-text">
              <h3>Diagnóstico Principal (Core ALMA)</h3>
              <p>{getDiagnosticCore()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="tabs-container">
        <div className="tabs-buttons">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as TabType)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <motion.div 
          className="tab-content"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'report' && (
            <ReportTab content={response.interpreted_response || response.displayData?.humanized_text} />
          )}
          {activeTab === 'metrics' && (
            <MetricsTab technicalData={response.technicalData || response.displayData?.technicalData} />
          )}
          {activeTab === 'rawdata' && (
            <RawDataTab data={response} />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;
