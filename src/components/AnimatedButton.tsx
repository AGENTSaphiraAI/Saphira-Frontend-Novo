import { motion } from 'framer-motion';
import React from 'react';

type AnimatedButtonProps = React.ComponentPropsWithoutRef<typeof motion.button>;

const AnimatedButton = ({ children, className, ...props }: AnimatedButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;