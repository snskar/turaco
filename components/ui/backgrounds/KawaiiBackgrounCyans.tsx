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
  cloudDensity = 4,
  cloudOpacity = 0.2,
}) => {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
    >
      {/* full-screen background */}
      <div className="fixed inset-0 w-full h-full">
        {/* 1) Softer pastel gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #FFD1EC 0%, #CBB2FE 60%, #A0F0EA 100%)',
          }}
        />

        {/* 3) Very subtle grid lines */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.08,
            backgroundImage: `
              linear-gradient(to right, rgba(255,240,250,0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(225,255,245,0.12) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
        <TwinklingStars starCount={40} />

        {/* 5) Clouds with reduced density, speed & opacity */}
        <div className="absolute inset-0">
          <Clouds
            density={cloudDensity}
            opacity={cloudOpacity}
            minSize={150}
            maxSize={350}
            minSpeed={6}
            maxSpeed={15}
            zIndex={5}
          />
        </div>

        {/* 6) Light, minimal sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.6)',
                left: `${(i * 19 + 11) % 100}%`,
                top: `${(i * 23 + 7) % 100}%`,
              }}
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* your page content (white text will now sit on that darkened overlay) */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default KawaiiBackgroundDarker;
