'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface EnhancedStarFieldProps {
  totalStars?: number;
  animatedStarRatio?: number; // Percentage of stars that animate (0-1)
  className?: string;
}

// Star path for consistent look
const starPath = `M12 2L12.75 11.25L22 12L12.75 12.75L12 22L11.25 12.75L2 12L11.25 11.25L12 2Z`;

// Deterministic random number generator
const mulberry32 = (a: number) => {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const EnhancedStarField: React.FC<EnhancedStarFieldProps> = ({
  totalStars = 50,
  animatedStarRatio = 0.3, // 30% animated, 70% static
  className = '',
}) => {
  // Generate stars with deterministic positions
  const { staticStars, animatedStars } = useMemo(() => {
    const seed = 12345;
    const random = mulberry32(seed);

    const animatedCount = Math.floor(totalStars * animatedStarRatio);
    const staticCount = totalStars - animatedCount;

    // Generate static stars (non-animated)
    const staticStarsArray = Array.from({ length: staticCount }, (_, i) => ({
      id: `static-${i}`,
      position: {
        x: random() * 100,
        y: random() * 100,
      },
      size: 8 + random() * 8, // Smaller range for subtlety
      opacity: 0.3 + random() * 0.4, // Varied opacity for depth
    }));

    // Generate animated stars (fewer, more prominent)
    const animatedStarsArray = Array.from(
      { length: animatedCount },
      (_, i) => ({
        id: `animated-${i}`,
        position: {
          x: random() * 100,
          y: random() * 100,
        },
        size: 10 + random() * 12,
        opacity: 0.6 + random() * 0.3,
        delay: random() * 2,
        duration: 3 + random() * 2,
      })
    );

    return {
      staticStars: staticStarsArray,
      animatedStars: animatedStarsArray,
    };
  }, [totalStars, animatedStarRatio]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Static Stars - No animation, just visual depth */}
      {staticStars.map(star => (
        <div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.position.x}%`,
            top: `${star.position.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            // Static transform for hardware acceleration
            transform: 'translate3d(0,0,0)',
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24">
            <path
              d={starPath}
              fill="rgba(255, 255, 255, 0.8)"
              style={{
                filter: `drop-shadow(0 0 ${star.size * 0.5}px rgba(255, 255, 255, 0.3))`,
              }}
            />
          </svg>
        </div>
      ))}

      {/* Animated Stars - Fewer but more prominent */}
      {animatedStars.map(star => (
        <motion.div
          key={star.id}
          className="absolute will-change-transform"
          style={{
            left: `${star.position.x}%`,
            top: `${star.position.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translate3d(0,0,0)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'linear',
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24">
            <path
              d={starPath}
              fill="rgba(255, 255, 255, 0.9)"
              style={{
                filter: `drop-shadow(0 0 ${star.size * 0.8}px rgba(255, 255, 255, 0.4))`,
              }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Additional subtle glow effects - very few */}
      {animatedStars.slice(0, 3).map(star => (
        <motion.div
          key={`glow-${star.id}`}
          className="absolute rounded-full bg-white/10 blur-xl"
          style={{
            left: `${star.position.x}%`,
            top: `${star.position.y}%`,
            width: star.size * 2,
            height: star.size * 2,
            transform: 'translate3d(0,0,0)',
          }}
          animate={{
            opacity: [0, 0.2, 0],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration * 1.5,
            repeat: Infinity,
            delay: star.delay + 1,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default EnhancedStarField;
