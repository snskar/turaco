'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpinTheWheel } from './utils';
import Image from 'next/image';
import { SpinTheWheelProps } from './types';

const SpinTheWheel: React.FC<SpinTheWheelProps> = ({
  options,
  centerImageSrc,
  onWin,
}) => {
  const {
    winner,
    isWonState,
    wheelSize,
    wheelRef,
    containerRef,
    radius,
    handleInteraction,
    renderSectors,
  } = useSpinTheWheel({ options, onWin });

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center p-4 relative select-none overflow-hidden"
    >
      {/* Win Pointer */}
      <div
        className="absolute z-20 transform -translate-x-1/2 pointer-events-none"
        style={{
          left: '50%',
          top: '-10px',
          width: '80px',
          height: '80px',
          filter: 'drop-shadow(0 2px 8px rgba(225,125,220,0.5))',
          willChange: 'transform',
        }}
      >
        <Image
          src="/assets/ui/win-pointer.png"
          alt="Winner Pointer"
          width={80}
          height={80}
          className="w-full h-full object-contain"
          draggable={false}
        />
        <div
          className="absolute inset-0 -z-10 blur-md opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(225,125,220,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Wheel Container */}
      <div
        className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-xl cursor-pointer
                   hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
        onClick={handleInteraction}
        onTouchEnd={handleInteraction}
        style={{
          marginTop: '20px',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
          WebkitTransform: 'translate3d(0,0,0)',
        }}
      >
        {/* Won State Overlay */}
        <AnimatePresence>
          {isWonState && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full z-50 pointer-events-none overflow-hidden"
            >
              {/* Base gradient matching wheel colors */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 182, 193, 0.95) 0%, rgba(225, 125, 220, 0.9) 50%, rgba(180, 130, 255, 0.85) 100%)',
                }}
              />

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)',
                  backgroundSize: '15px 15px',
                }}
              />

              {/* Floating stars */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.3, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3 + (i % 2),
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  style={{
                    left: `${20 + ((i * 10) % 60)}%`,
                    top: `${15 + ((i * 12) % 70)}%`,
                  }}
                />
              ))}

              {/* Shimmering effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-pink-200/20 via-purple-300/20 to-cyan-200/20"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Won State Center Text */}
        <AnimatePresence>
          {isWonState && winner && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                y: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                y: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                duration: 0.8,
              }}
              className="absolute inset-0 flex items-center justify-center z-60 pointer-events-none"
            >
              <div className="text-center relative">
                {/* Text glow background */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="absolute inset-0 -m-8 rounded-2xl blur-xl"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, rgba(225, 125, 220, 0.3) 50%, transparent 100%)',
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative text-4xl md:text-6xl font-bold text-white mb-4"
                  style={{
                    textShadow:
                      '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255, 182, 193, 0.6), 0 0 90px rgba(225, 125, 220, 0.4)',
                    filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                  }}
                >
                  {winner}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative text-lg text-white/90 font-medium"
                  style={{
                    textShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                >
                  Tap to spin again
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shimmering overlay */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{ mixBlendMode: 'soft-light' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-pink-200/20 via-purple-300/20 to-cyan-200/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />
        </div>

        <svg
          ref={wheelRef}
          width={wheelSize}
          height={wheelSize}
          className="transition-transform duration-100 relative z-10"
          style={{
            borderRadius: '50%',
          }}
        >
          <defs>
            {/* Holographic gradients */}
            <linearGradient id="sectorGradient1" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="rgba(255, 182, 193, 0.9)" />
              <stop offset="50%" stopColor="rgba(225, 125, 220, 0.85)" />
              <stop offset="100%" stopColor="rgba(180, 130, 255, 0.8)" />
            </linearGradient>
            <linearGradient id="sectorGradient2" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="rgba(176, 224, 230, 0.9)" />
              <stop offset="50%" stopColor="rgba(130, 180, 255, 0.85)" />
              <stop offset="100%" stopColor="rgba(144, 238, 244, 0.8)" />
            </linearGradient>

            {/* Iridescent overlay */}
            <linearGradient id="iridescent" x1="0" y1="0" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>

          {renderSectors().map((sector, i) => (
            <g key={i}>
              {sector.shouldRender && (
                <>
                  <path
                    d={sector.pathData}
                    fill={
                      sector.isWinningSector
                        ? 'url(#sectorGradient1)'
                        : i % 2 === 0
                          ? 'url(#sectorGradient1)'
                          : 'url(#sectorGradient2)'
                    }
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                    className="transition-all duration-200"
                  />
                  <text
                    x={Number(sector.textX).toFixed(2)}
                    y={Number(sector.textY).toFixed(2)}
                    fill="white"
                    fontSize={
                      sector.isWinningSector
                        ? Number((sector.fontSize * 1.5).toFixed(2))
                        : Number(sector.fontSize.toFixed(2))
                    }
                    fontWeight="600"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${Number(sector.textRotation).toFixed(2)}, ${Number(sector.textX).toFixed(2)}, ${Number(sector.textY).toFixed(2)})`}
                    style={{
                      textShadow: sector.isWinningSector
                        ? '0 0 20px rgba(255,255,255,0.8)'
                        : 'none',
                    }}
                  >
                    {sector.option}
                  </text>
                </>
              )}
            </g>
          ))}

          {/* Center Image with holographic effect */}
          <defs>
            <clipPath id="circleView">
              <circle cx={radius} cy={radius} r={radius * 0.28} />
            </clipPath>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(225,125,220,0.3)" />
              <stop offset="100%" stopColor="rgba(130,180,255,0.1)" />
            </radialGradient>
          </defs>
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.28}
            fill="url(#centerGlow)"
            className="backdrop-blur-sm"
          />
          <image
            href={centerImageSrc}
            x={radius - radius * 0.28}
            y={radius - radius * 0.28}
            width={radius * 0.56}
            height={radius * 0.56}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Iridescent overlay for the entire wheel */}
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="url(#iridescent)"
            className="mix-blend-overlay opacity-50"
          />
        </svg>
      </div>

      {/* Winner Display - Only show when not in won state */}
      <AnimatePresence>
        {winner && !isWonState && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 text-2xl font-bold text-white drop-shadow-glow"
          >
            {winner}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinTheWheel;
