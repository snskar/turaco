"use client";

import React from 'react';
import { motion } from 'framer-motion';

// Updated star paths to match the sharp four-pointed star design
const starVariants = {
  sharp: `M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z`,
  sharpSmall: `M12 4L13 10L20 12L13 14L12 20L11 14L4 12L11 10L12 4Z`,
  minimal: `M12 2L12.75 11.25L22 12L12.75 12.75L12 22L11.25 12.75L2 12L11.25 11.25L12 2Z`,
};

interface StarProps {
  variant: 'sharp' | 'minimal' | 'sharpSmall';
  size: number;
  position: { x: number; y: number };
  delay: number;
  rotation?: number;
}

interface TwinklingStarsProps {
  starCount?: number;
}

// Deterministic random number generator
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const generateStars = (count: number) => {
  const rand = mulberry32(count); // Seed with starCount for consistency
  const variants = ['sharp', 'minimal', 'sharpSmall'];
  
  return Array.from({ length: count }, (_, i) => {
    return {
      variant: variants[Math.floor(rand() * 3)] as StarProps['variant'],
      size: 10 + rand() * 15,
      position: {
        x: rand() * 100,
        y: rand() * 100
      },
      delay: rand() * 2,
      rotation: rand() * 360
    };
  });
};

const Star: React.FC<StarProps> = ({ variant, size, position, delay, rotation = 0 }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0.1, 0.8, 0.1],
        scale: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        <path
          d={starVariants[variant]}
          fill="rgba(255, 255, 255, 0.9)"
        />
      </svg>
    </motion.div>
  );
};

const TwinklingStars: React.FC<TwinklingStarsProps> = ({ starCount = 40 }) => {
  // Generate stars with deterministic values
  const stars = React.useMemo(() => generateStars(starCount), [starCount]);
  const rand = mulberry32(starCount + 1000); // Different seed for glows and tiny stars

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {/* Main stars */}
      {stars.map((star, index) => (
        <Star key={`star-${index}`} {...star} />
      ))}

      {/* Subtle glow effects */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute"
          style={{
            width: '150px',
            height: '150px',
            left: `${rand() * 100}%`,
            top: `${rand() * 100}%`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Tiny background stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`tiny-${i}`}
          className="absolute bg-white"
          style={{
            width: '1px',
            height: '1px',
            left: `${rand() * 100}%`,
            top: `${rand() * 100}%`,
            boxShadow: '0 0 2px rgba(255,255,255,0.5)',
          }}
          animate={{
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default TwinklingStars; 