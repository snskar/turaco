import {PLAY_SIZE} from './constants';
import { ReactElement } from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';

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
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Image 
        src="/assets/play.png" 
        alt="Catching jar" 
        width={PLAY_SIZE.width}
        height={PLAY_SIZE.height}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </motion.div>
  );