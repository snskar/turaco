"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TwinklingStarsProps {
  starCount?: number;
}

// Updated star paths to match the sharp four-pointed star design
const starVariants = {
  minimal: `M12 2L12.75 11.25L22 12L12.75 12.75L12 22L11.25 12.75L2 12L11.25 11.25L12 2Z`,
};

// Deterministic random number generator
const mulberry32 = (a: number) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
};

const TwinklingStars: React.FC<TwinklingStarsProps> = ({ starCount = 40 }) => {
  // Generate stars with deterministic values
  const stars = useMemo(() => {
    const seed = 12345; // Fixed seed for deterministic generation
    const random = mulberry32(seed);
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      position: {
        x: random() * 100,
        y: random() * 100
      },
      size: 10 + random() * 15,
      delay: random() * 2
    }));
  }, [starCount]);

  // Memoize glow effects with deterministic positions
  const glowEffects = useMemo(() => {
    const seed = 67890; // Different fixed seed for glow effects
    const random = mulberry32(seed);
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      position: {
        x: random() * 100,
        y: random() * 100
      },
      size: 20 + random() * 30,
      opacity: 0.1 + random() * 0.2,
      delay: random() * 2
    }));
  }, [starCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.position.x}%`,
            top: `${star.position.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + (star.id % 3), // Deterministic duration based on star id
            repeat: Infinity,
            delay: star.delay,
          }}
        >
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
          >
            <path
              d={starVariants.minimal}
              fill="rgba(255, 255, 255, 0.9)"
            />
          </svg>
        </motion.div>
      ))}
      {glowEffects.map((glow) => (
        <motion.div
          key={glow.id}
          className="absolute rounded-full bg-white/20 blur-xl"
          style={{
            left: `${glow.position.x}%`,
            top: `${glow.position.y}%`,
            width: glow.size,
            height: glow.size,
            opacity: glow.opacity,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, glow.opacity, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + (glow.id % 2), // Deterministic duration based on glow id
            repeat: Infinity,
            delay: glow.delay,
          }}
        />
      ))}
    </div>
  );
};

export default TwinklingStars; 