import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { JAR_SIZE } from './constants';

export const Jar = ({ x }: { x: number }): ReactElement => (
  <motion.div
    className="absolute bottom-4"
    style={{
      width: JAR_SIZE.width,
      height: JAR_SIZE.height,
      left: x,
    }}
  >
    <OptimizedImage
      src="/assets/art/jar.png"
      alt="Catching jar"
      width={JAR_SIZE.width}
      height={JAR_SIZE.height}
      className="w-full h-full object-contain"
      useCloudinary={true}
    />
  </motion.div>
);
