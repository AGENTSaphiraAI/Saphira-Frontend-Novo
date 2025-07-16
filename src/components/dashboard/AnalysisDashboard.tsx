import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { exportSaphiraReportToPdf } from '../../utils/exportToPdf';
import './AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technicalData?: any;
    verificationCode?: string;
  };
  handleExportDocx: () => Promise<void>;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response, handleExportDocx }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(response.humanized_text || '').then(() => alert('Relatório copiado!'));
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await exportSaphiraReportToPdf(response);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      className="analysis-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="dashboard-header">
        <div>
          <h2>📊 Dashboard de Análise Saphira</h2>
          {response.verificationCode && <span className="verification-code">🔍 Código: {response.verificationCode}</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="export-button" onClick={handleExportDocx}><Download size={18} /> DOC</button>
          <button className="export-button" onClick={handleExportPdf} disabled={isExporting}><Download size={18} /> {isExporting ? '...' : 'PDF'}</button>
        </div>
      </div>

      <div className="report-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0 }}>Análise Interpretada da Saphira</h4>
          <button onClick={handleCopy} className="copy-button">
            <Copy size={16} /> Copiar
          </button>
        </div>
        <div className="markdown-body">
          <ReactMarkdown>
            {response.humanized_text || "Aguardando análise..."}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisDashboard;