import React from 'react';
import { motion } from 'framer-motion';

interface HolographicTextProps {
  children: string;
  className?: string;
  strokeWidth?: number; // Width of the stroke in pixels
  strokeOpacity?: number; // Opacity of the stroke
}

const HolographicText: React.FC<HolographicTextProps> = ({ 
  children, 
  className = '',
  strokeWidth,
  strokeOpacity = 0.8,
}) => {
  // Generate star glints at specific positions
  const starGlints = [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { top: '50%', left: '50%' },
    { bottom: 0, right: '20%' },
  ];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Stroke layer (only rendered if strokeWidth is provided) */}
      {strokeWidth && (
        <motion.div
          className="absolute inset-0 text-8xl font-bold tracking-wider"
          style={{
            color: 'transparent',
            WebkitTextStroke: `${strokeWidth}px transparent`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundImage: 'linear-gradient(135deg, rgba(147,51,234,0.8) 0%, rgba(236,72,153,0.8) 50%, rgba(99,102,241,0.8) 100%)',
            opacity: strokeOpacity,
            transform: 'scale(1.01)', // Slightly larger to ensure stroke is visible
            filter: 'blur(0.3px)', // Subtle blur for smoother appearance
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.div>
      )}

      {/* Main text with chrome effect */}
      <motion.div
        className="relative text-transparent bg-clip-text"
        style={{
          WebkitBackgroundClip: 'text',
          backgroundImage: 'linear-gradient(135deg, #00e5ff 0%, #e0c3fc 35%, #00fff2 65%, #8ec5fc 100%)',
          backgroundSize: '400% 400%',
          filter: 'brightness(1.2) contrast(1.2)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-8xl font-bold tracking-wider">{children}</span>
      </motion.div>

      {/* Holographic edge glow */}
      <div
        className="absolute inset-0 text-8xl font-bold tracking-wider"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(255,255,255,0.2)',
          filter: 'blur(1px)',
        }}
      >
        {children}
      </div>

      {/* Inner chrome highlight */}
      <div
        className="absolute inset-0 text-8xl font-bold tracking-wider"
        style={{
          backgroundImage: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.4), transparent)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          mixBlendMode: 'overlay',
        }}
      >
        {children}
      </div>

      {/* Iridescent overlay */}
      <motion.div
        className="absolute inset-0 text-8xl font-bold tracking-wider"
        style={{
          backgroundImage: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          mixBlendMode: 'plus-lighter',
        }}
        animate={{
          backgroundPosition: ['200% 0%', '-100% 100%'],
          filter: [
            'hue-rotate(0deg) brightness(1)',
            'hue-rotate(90deg) brightness(1.2)',
            'hue-rotate(180deg) brightness(1)',
            'hue-rotate(270deg) brightness(1.2)',
            'hue-rotate(360deg) brightness(1)',
          ],
        }}
        transition={{
          backgroundPosition: {
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          },
          filter: {
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {children}
      </motion.div>

      {/* Star glints */}
      {starGlints.map((position, index) => (
        <motion.div
          key={`glint-${index}`}
          className="absolute w-4 h-4 pointer-events-none"
          style={{
            ...position,
            background: 'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 50%)',
            filter: 'blur(0.5px)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        />
      ))}

      {/* Chromatic aberration effect */}
      <div
        className="absolute inset-0 text-8xl font-bold tracking-wider opacity-50"
        style={{
          color: 'transparent',
          textShadow: `
            -2px 0 2px rgba(255,0,255,0.3),
            2px 0 2px rgba(0,255,255,0.3)
          `,
          mixBlendMode: 'screen',
        }}
      >
        {children}
      </div>

      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 text-8xl font-bold tracking-wider"
        style={{
          filter: 'blur(20px)',
          opacity: 0.3,
          backgroundImage: 'linear-gradient(135deg, #00e5ff 0%, #e0c3fc 50%, #00fff2 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HolographicText; 