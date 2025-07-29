
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import ReportTab from './tabs/ReportTab';
import StatusBadge from './StatusBadge';
import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    displayData?: {
      humanized_text?: string;
      verification_code?: string;
    };
    rawData?: any;
    // Fallback para estruturas antigas
    humanized_text?: string;
    technicalData?: any;
    verificationCode?: string;
  };
  handleExportResponseJSON?: () => void;
  handleExportDocx?: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ 
  response, 
  handleExportResponseJSON, 
  handleExportDocx 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      // Determinar a estrutura dos dados
      const humanizedText = response.displayData?.humanized_text || response.humanized_text;
      const technicalData = response.rawData || response.technicalData;
      const verificationCode = response.displayData?.verification_code || response.verificationCode;

      await exportSaphiraReportToPdf({ 
        humanized_text: humanizedText,
        technical_data: technicalData,
        verificationCode: verificationCode,
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('❌ Erro ao exportar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Lógica de mapeamento robusta que funciona com diferentes estruturas
  const rawData = response.rawData || response.technicalData || {};
  const displayData = response.displayData || {};
  
  // Fallbacks para diferentes estruturas de dados
  const humanizedText = displayData.humanized_text || response.humanized_text || 'Resposta não disponível';
  const verificationCode = displayData.verification_code || response.verificationCode;

  // Mapeamento seguro dos dados técnicos
  const voiceMode = rawData.voice_calibration?.voice_mode || 
                   rawData.voiceCalibration?.voiceMode || 
                   'N/A';
                   
  const overallRisk = rawData.forensic_analysis?.overall_manipulation_risk || 
                     rawData.forensicAnalysis?.overallManipulationRisk ||
                     rawData.overall_risk ||
                     'N/A';
                     
  const confidence = rawData.confidence_level?.score 
    ? `${(rawData.confidence_level.score * 100).toFixed(0)}%`
    : rawData.confidenceLevel?.score 
    ? `${(rawData.confidenceLevel.score * 100).toFixed(0)}%`
    : rawData.confidence 
    ? `${rawData.confidence}%`
    : '0%';

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
        </div>
        <div className="dashboard-export-buttons">
          {handleExportResponseJSON && (
            <button className="export-button json" onClick={handleExportResponseJSON}>
              <Download size={18} /> JSON
            </button>
          )}
          {handleExportDocx && (
            <button className="export-button doc" onClick={handleExportDocx}>
              <Download size={18} /> DOC
            </button>
          )}
          <button className="export-button pdf" onClick={handleExportPdf} disabled={isExporting}>
            <Download size={18} /> {isExporting ? 'Exportando...' : 'PDF'}
          </button>
        </div>
      </div>
      
      <div className="status-header">
        <StatusBadge 
          icon="🎤" 
          label="Modo de Voz" 
          value={voiceMode} 
          tooltip="O tom e a personalidade que a Saphira adotou para a análise (ex: Juíza, Consultora)."
        />
        <StatusBadge 
          icon="🛡️" 
          label="Risco Geral" 
          value={overallRisk} 
          tooltip="Avaliação do risco de manipulação textual com base em fatores como carga emocional, linguagem absolutista e qualidade das fontes."
        />
        <StatusBadge 
          icon="🎯" 
          label="Confiança" 
          value={confidence} 
          tooltip="Nível de confiança da Saphira em sua própria análise, com base na clareza e consistência dos dados de entrada."
        />
      </div>
      
      <div className="dashboard-content">
        <ReportTab 
          interpretedResponse={humanizedText}
          verificationCode={verificationCode}
        />
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;
