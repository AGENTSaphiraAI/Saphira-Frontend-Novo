
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';
import { exportSaphiraReportToPdf } from '@/utils/exportToPdf';
import '@/components/dashboard/AnalysisDashboard.css';

interface AnalysisDashboardProps {
  response: {
    humanized_text?: string;
    technicalData?: any;
    verificationCode?: string;
  };
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ response }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Backend URL - mesma que é usada no App.tsx
  const BACKEND_BASE_URL = "https://b70cbe73-5ac1-4669-ac5d-3129d59fb7a8-00-3ccdko9zwgzm3.riker.replit.dev";

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

  // Lógica de exportação DOCX movida para dentro do componente
  const handleExportDocx = async () => {
    if (!response) {
      alert("⚠️ Nenhuma resposta para exportar.");
      return;
    }
    console.log("📥 Iniciando exportação para DOCX...");
    
    try {
      const exportResponse = await fetch(`${BACKEND_BASE_URL}/api/export/docx`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          humanized_text: response.humanized_text,
          verificationCode: response.verificationCode
        })
      });

      if (!exportResponse.ok) {
        throw new Error(`Erro no servidor: ${exportResponse.statusText}`);
      }
      
      const blob = await exportResponse.blob();
      const fileName = `saphira_relatorio_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.docx`;
      saveAs(blob, fileName);
      console.log(`✅ Relatório DOCX exportado: ${fileName}`);

    } catch (err) {
      console.error("❌ Erro ao exportar DOCX:", err);
      alert("Falha ao gerar o relatório DOCX. Verifique o console.");
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
