import {JAR_SIZE} from './constants';
import { ReactElement } from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';

export const Jar = ({ x }: { x: number }): ReactElement => (
    <motion.div
      className="absolute bottom-4"
      style={{
        width: JAR_SIZE.width,
        height: JAR_SIZE.height,
        left: x
      }}
    >
      <Image 
        src="/assets/art/jar.png" 
        alt="Catching jar" 
        width={JAR_SIZE.width}
        height={JAR_SIZE.height}
        className="w-full h-full object-contain"
      />
    </motion.div>
  );