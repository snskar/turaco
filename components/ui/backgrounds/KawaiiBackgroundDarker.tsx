'use client';

import React from 'react';
import { motion } from 'framer-motion';
import EnhancedStarField from './EnhancedStarField';
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
  cloudDensity = 7, // Increased from 5 to 7 for higher density
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

        {/* Enhanced Star field - mix of static and animated */}
        <EnhancedStarField
          totalStars={60}
          animatedStarRatio={0.25} // Only 25% animate, 75% static
        />

        {/* Clouds Layer - optimized with mix of static and animated */}
        <div className="absolute inset-0 w-full h-full">
          <Clouds
            density={cloudDensity}
            opacity={cloudOpacity}
            minSize={100}
            maxSize={250}
            minSpeed={20} // Reduced by 50% from 40 to 20
            maxSpeed={40} // Reduced by 50% from 80 to 40
            zIndex={5}
            staticRatio={0.65} // 65% static, 35% animated for better performance
          />
        </div>

        {/* Additional Stars - reduced count and optimized */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full will-change-transform"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + (i % 2),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'linear',
              }}
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 3) % 100}%`,
                transform: 'translate3d(0,0,0)', // Force hardware acceleration
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
