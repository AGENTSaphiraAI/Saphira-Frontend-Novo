
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import RadarAnalysisCard from '../cards/RadarAnalysisCard';
import ToneAnalysisCard from '../cards/ToneAnalysisCard';
import IntegrityCard from '../cards/IntegrityCard';
import NexumKeywordsCard from '../cards/NexumKeywordsCard';

interface MetricsTabProps {
  technicalData: any;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ technicalData }) => {
  return (
    <motion.div 
      className="metrics-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="metrics-header">
        <BarChart3 className="header-icon" size={24} />
        <div>
          <h3>Análise Técnica Visual</h3>
          <p>Métricas e indicadores em gráficos interativos</p>
        </div>
      </div>

      <div className="metrics-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <RadarAnalysisCard technicalData={technicalData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ToneAnalysisCard technicalData={technicalData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <IntegrityCard technicalData={technicalData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <NexumKeywordsCard technicalData={technicalData} />
        </motion.div>
      </div>

      <style>{`
        .metrics-tab {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .metrics-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-icon {
          color: #0b74e5;
        }

        .metrics-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .metrics-header p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          flex: 1;
          min-height: 400px;
        }

        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default MetricsTab;
