'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TwinklingStars from './TwinklingStars';

const KawaiiBackgroundDarker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#0f0f1a] text-white overflow-hidden">
      {/* Full-screen animated holographic gradient */}
      <motion.div
        className="fixed inset-0 -z-20"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          backgroundImage: `
            linear-gradient(130deg, rgba(255,153,255,0.3), rgba(102,253,253,0.25), rgba(255,200,125,0.2), rgba(173,255,196,0.2))
          `,
          backgroundSize: '300% 300%',
          filter: 'blur(100px)'
        }}
      />

      {/* Iridescent overlays */}
      <motion.div
        className="fixed top-1/4 left-[-20%] w-[140%] h-[140%] pointer-events-none -z-10 opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'radial-gradient(circle at center, #ff99ff55, #66fdfd33, #ffc87722, transparent)',
          filter: 'blur(140px)'
        }}
      />

      {/* Background Grid Overlay */}
      <div
        className="fixed inset-0 opacity-10 -z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Animated Floating Blobs (cloud-like but more iridescent) */}
      {[
        { size: 32, top: '15%', left: '-10%', opacity: 0.4 },
        { size: 40, top: '45%', right: '-10%', opacity: 0.3 },
        { size: 36, top: '70%', left: '-15%', opacity: 0.35 }
      ].map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none blur-2xl -z-10"
          style={{
            width: `${blob.size}vw`,
            height: `${blob.size * 0.6}vw`,
            top: blob.top,
            left: blob.left,
            right: blob.right,
            background: 'linear-gradient(135deg, #ff99ff80, #66fdfd66)',
            opacity: blob.opacity
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            y: ['0%', '3%', '0%']
          }}
          transition={{
            duration: 18 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + (i % 2),
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              left: `${(i * 37 + 7) % 100}%`,
              top: `${(i * 53 + 3) % 100}%`
            }}
          />
        ))}
      </div>

      {/* Additional starfield layer */}
      <TwinklingStars starCount={75} />

      {/* Foreground content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default KawaiiBackgroundDarker;
