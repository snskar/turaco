'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useScratchCard } from './hooks';
import { ScratchCardProps } from './types';

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 300,
  height = 150,
  text = 'Scratch Me!',
  revealText = 'You Won! 🎉',
  onComplete,
  isInteractive = true,
}) => {
  const { canvasRef, containerRef, cleared } = useScratchCard({
    width,
    height,
    isInteractive,
    onComplete,
    text,
  });

  return (
    <div className="flex flex-col items-center">
      <motion.div
        ref={containerRef}
        className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg"
        style={{ width, height }}
        initial={{ scale: 1 }}
        animate={cleared ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* bg-gradient-to-br from-blue-400/90 via-purple-400/90 to-pink-400/90 */}
        {/* bg-gradient-to-br from-white via-white to-blue-50 */}
        <div className="absolute inset-0 z-0 flex items-center justify-center text-center px-4 font-bold bg-gradient-to-br from-white via-white to-blue-50">
          <span className="text-lg text-gray-800">{revealText}</span>
        </div>
        {!cleared && (
          <div className="absolute inset-0 z-10">
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 z-20 touch-none touch-action-none rounded-2xl ${!isInteractive ? 'pointer-events-none' : ''}`}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ScratchCard;
