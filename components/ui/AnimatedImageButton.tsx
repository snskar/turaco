import { ReactElement } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from './OptimizedImage';

interface AnimatedImageButtonProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClick?: () => void;
  className?: string;
  rotateOnHover?: boolean;
}

export const AnimatedImageButton = ({
  src,
  alt,
  width,
  height,
  onClick,
  className = '',
  rotateOnHover = false,
}: AnimatedImageButtonProps): ReactElement => (
  <motion.div
    className={`items-center justify-center cursor-pointer ${className}`}
    style={{
      width,
      height,
    }}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.5, opacity: 0 }}
    whileHover={{
      scale: 1.1,
      rotate: rotateOnHover ? 180 : 0,
    }}
    whileTap={{ scale: 1.2 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    onClick={onClick}
  >
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="w-full h-full object-contain drop-shadow-lg"
      draggable={false}
      useCloudinary={true}
    />
  </motion.div>
);
