import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { PLAY_SIZE } from './constants';

export const Play = (): ReactElement => (
  <motion.div
    className="items-center justify-center"
    style={{
      width: PLAY_SIZE.width,
      height: PLAY_SIZE.height,
    }}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    whileTap={{ scale: 1.2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  >
    <OptimizedImage
      src="/assets/ui/play.png"
      alt="Play button"
      width={PLAY_SIZE.width}
      height={PLAY_SIZE.height}
      className="w-full h-full object-contain"
      draggable={false}
      useCloudinary={true}
    />
  </motion.div>
);
