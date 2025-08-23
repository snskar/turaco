import React, { ReactElement } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { DROP_SIZE } from './constants';

export interface DropType {
  id: number;
  xRatio: number;
  yRatio: number;
  lastUpdate: number;
}

export const Drop = React.memo(
  ({ drop }: { drop: DropType }): ReactElement => (
    <motion.div
      className="absolute will-change-transform"
      style={{
        left: `${drop.xRatio * 100}%`,
        top: `${drop.yRatio * 100}%`,
        width: DROP_SIZE.width,
        height: DROP_SIZE.height,
        transform: 'translate3d(0,0,0)', // Force hardware acceleration
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'linear' }}
    >
      <OptimizedImage
        src="/assets/art/drop.png"
        alt="Falling compliment drop"
        width={DROP_SIZE.width}
        height={DROP_SIZE.height}
        className="w-full h-full object-contain"
        loading="lazy"
        quality={75}
        useCloudinary={true}
      />
    </motion.div>
  )
);

Drop.displayName = 'Drop';
