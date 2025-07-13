
import React from 'react';
import { motion } from 'framer-motion';
import RadarAnalysisCard from '../cards/RadarAnalysisCard';
import ToneAnalysisCard from '../cards/ToneAnalysisCard';
import IntegrityCard from '../cards/IntegrityCard';
import NexumKeywordsCard from '../cards/NexumKeywordsCard';
import './MetricsTab.css';

interface MetricsTabProps {
  technicalData: any;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ technicalData }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="metrics-tab">
      <div className="metrics-header">
        <h2>📊 Análise Visual de Métricas</h2>
        <p className="metrics-description">
          Visualização interativa dos dados técnicos extraídos pela Saphira
        </p>
      </div>

      <motion.div 
        className="metrics-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <RadarAnalysisCard data={technicalData} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <ToneAnalysisCard data={technicalData} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <IntegrityCard data={technicalData} />
        </motion.div>

        <motion.div variants={cardVariants}>
          <NexumKeywordsCard keywords={technicalData?.keywords || []} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MetricsTab;
