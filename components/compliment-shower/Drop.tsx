import {DROP_SIZE} from './constants';
import { ReactElement } from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';

export interface DropType {
    id: number;
    xRatio: number;
    yRatio: number;
    lastUpdate: number;
  }
  
  export const Drop = ({ drop }: { drop: DropType }): ReactElement => (
    <motion.div
      className="absolute"
      style={{
        left: `${drop.xRatio * 100}%`,
        top: `${drop.yRatio * 100}%`,
        width: DROP_SIZE.width,
        height: DROP_SIZE.height
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Image 
        src="/assets/drop.png" 
        alt="Falling compliment drop" 
        width={DROP_SIZE.width}
        height={DROP_SIZE.height}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );