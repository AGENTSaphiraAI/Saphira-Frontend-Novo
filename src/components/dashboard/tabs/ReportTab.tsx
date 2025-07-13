
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileText } from 'lucide-react';
import { exportToPDF } from '../../../utils/exportToPdf';
import './ReportTab.css';

interface ReportTabProps {
  content: string;
}

const ReportTab: React.FC<ReportTabProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleExportPDF = async () => {
    if (exporting) return;
    
    setExporting(true);
    try {
      const metricsElement = document.querySelector('.metrics-grid') as HTMLElement;
      
      await exportToPDF({
        reportContent: content || 'Nenhum conteúdo disponível',
        metricsElement: metricsElement || undefined,
        metadata: {
          timestamp: new Date().toISOString(),
          originalText: 'Análise Saphira',
        }
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar PDF. Tente novamente.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="report-tab">
      <div className="report-header">
        <h2>📄 Relatório de Análise Saphira</h2>
        <div className="report-actions">
          <button
            className={`action-button pdf-button ${exporting ? 'loading' : ''}`}
            onClick={handleExportPDF}
            disabled={exporting}
            title="Exportar relatório em PDF"
          >
            <FileText size={18} />
            <span>{exporting ? 'Gerando...' : 'PDF'}</span>
          </button>
          
          <button
            className={`action-button copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copiar relatório completo"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <motion.div 
        className="report-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="content-card">
          <div className="markdown-content">
            {content ? (
              <pre className="formatted-text">{content}</pre>
            ) : (
              <div className="no-content">
                <p>📝 Nenhum relatório disponível para esta análise.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="report-footer">
        <p className="footer-text">
          <span className="saphira-badge">💙 Saphira</span>
          Gerado em {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default ReportTab;
