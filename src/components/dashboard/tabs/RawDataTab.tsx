
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Download } from 'lucide-react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';

interface RawDataTabProps {
  technicalData: any;
}

const RawDataTab: React.FC<RawDataTabProps> = ({ technicalData }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJson = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(technicalData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `saphira_analysis_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      alert('❌ Erro ao exportar JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const formatJsonForDisplay = (data: any) => {
    if (!data) return { message: "Nenhum dado técnico disponível" };
    
    return {
      timestamp: new Date().toISOString(),
      saphira_analysis: {
        version: "3.1",
        ...data
      },
      metadata: {
        generated_by: "Saphira Frontend v3.1",
        export_time: new Date().toLocaleString('pt-BR')
      }
    };
  };

  return (
    <motion.div 
      className="raw-data-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="tab-header">
        <div className="header-content">
          <Code className="header-icon" size={24} />
          <div>
            <h3>Dados Técnicos Completos</h3>
            <p>JSON estruturado da análise Saphira</p>
          </div>
        </div>
        
        <button 
          className="export-button"
          onClick={handleExportJson}
          disabled={isExporting}
        >
          <Download size={20} />
          {isExporting ? 'Exportando...' : 'Exportar JSON'}
        </button>
      </div>

      <div className="data-content">
        <div className="json-viewer-wrapper">
          <JsonView 
            src={formatJsonForDisplay(technicalData)}
            theme="vscode"
            collapsed={2}
            displaySize={true}
            enableClipboard={true}
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default RawDataTab;
