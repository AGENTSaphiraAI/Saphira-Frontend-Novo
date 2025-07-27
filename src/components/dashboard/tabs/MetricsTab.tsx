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

  const divAnimationProps = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.5 }
  });

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

      {/* 
        GRID CORRIGIDO: Passando o objeto 'technicalData' inteiro para cada card.
        Cada card agora é responsável por extrair a informação que precisa.
        Isso resolve o erro de tipagem na build.
      */}
      <div className="metrics-grid">
        <motion.div {...divAnimationProps(0.1)}>
          <RadarAnalysisCard technicalData={technicalData} />
        </motion.div>

        <motion.div {...divAnimationProps(0.2)}>
          <ToneAnalysisCard technicalData={technicalData} />
        </motion.div>

        <motion.div {...divAnimationProps(0.3)}>
          <IntegrityCard technicalData={technicalData} />
        </motion.div>

        <motion.div {...divAnimationProps(0.4)}>
          <NexumKeywordsCard technicalData={technicalData} />
        </motion.div>
      </div>

    </motion.div>
  );
};

export default MetricsTab;