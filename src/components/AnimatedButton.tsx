
import React from 'react';
import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

interface AnimatedButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'file' | 'export' | 'audit' | 'danger';
  badge?: number;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  variant = 'primary', 
  badge, 
  className = '', 
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'primary-btn';
      case 'secondary': return 'secondary-btn';
      case 'file': return 'file-btn';
      case 'export': return 'export-btn';
      case 'audit': return 'audit-btn';
      case 'danger': return 'danger-btn';
      default: return 'primary-btn';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`animated-button ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <motion.span 
          className="badge animate-pulse"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
};

export default AnimatedButton;
