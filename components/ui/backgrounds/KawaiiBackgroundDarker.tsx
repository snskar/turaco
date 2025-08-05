'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TwinklingStars from './TwinklingStars';
import { Clouds } from './Clouds';

interface KawaiiBackgroundDarkerProps {
  children: React.ReactNode;
  className?: string;
  cloudDensity?: number;
  cloudOpacity?: number;
}

export const KawaiiBackgroundDarker: React.FC<KawaiiBackgroundDarkerProps> = ({
  children,
  className = '',
  cloudDensity = 5,
  cloudOpacity = 0.3,
}) => {
  return (
    <div
      className={`relative min-h-screen w-full bg-gradient-to-b from-purple-900/80 to-pink-900/80 ${className}`}
    >
      {/* Background wrapper - fixed position */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Base gradient - darker and more saturated */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300" />

        {/* Grid Pattern with slightly darker lines */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.15) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Star field layer */}
        <TwinklingStars starCount={75} />

        {/* Clouds Layer */}
        <div className="absolute inset-0 w-full h-full">
          <Clouds
            density={cloudDensity * 1.5}
            opacity={cloudOpacity}
            minSize={150}
            maxSize={400}
            minSpeed={15}
            maxSpeed={40}
            zIndex={5}
          />
        </div>

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + (i % 2),
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 3) % 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default KawaiiBackgroundDarker;
