"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpinTheWheel } from "./utils";
import TextBox from "@/components/ui/TextBox";
import Image from "next/image";

interface SpinTheWheelProps {
  options: string[];
  centerImageSrc: string;
  onWin?: (winner: string) => void;
}

const SpinTheWheel: React.FC<SpinTheWheelProps> = ({ 
  options, 
  centerImageSrc,
  onWin 
}) => {
  const {
    isSpinning,
    winner,
    wheelSize,
    wheelRef,
    containerRef,
    radius,
    spin,
    renderSectors
  } = useSpinTheWheel({ options, onWin });

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center p-4 relative"
    >
      {/* Win Pointer */}
      <div 
        className="absolute z-20 transform -translate-x-1/2"
        style={{
          left: '50%',
          top: '-10px', // Adjust this value to control how much the pointer overlaps
          width: '80px', // Adjust size as needed
          height: '80px',
          filter: 'drop-shadow(0 2px 8px rgba(225,125,220,0.5))',
        }}
      >
        <Image
          src="/assets/ui/win-pointer.png"
          alt="Winner Pointer"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
        {/* Glow effect behind the pointer */}
        <div
          className="absolute inset-0 -z-10 blur-md opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(225,125,220,0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Wheel Container */}
      <div 
        className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-xl cursor-pointer
                   hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
        onClick={!isSpinning ? spin : undefined}
        style={{
          marginTop: '20px', // Adjust this to control the gap between pointer and wheel
        }}
      >
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
              ease: "easeInOut",
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
              <path
                d={sector.pathData}
                fill={i % 2 === 0 ? 'url(#sectorGradient1)' : 'url(#sectorGradient2)'}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                className="transition-all duration-200"
              />
              <text
                x={Number(sector.textX).toFixed(2)}
                y={Number(sector.textY).toFixed(2)}
                fill="white"
                fontSize={Number(sector.fontSize).toFixed(2)}
                fontWeight="600"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${Number(sector.textRotation).toFixed(2)}, ${Number(sector.textX).toFixed(2)}, ${Number(sector.textY).toFixed(2)})`}
              >
                {sector.option}
              </text>
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

      {/* Winner Display */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-xl font-bold text-center p-4 rounded-lg
                     bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-cyan-400/30
                     backdrop-blur-md shadow-lg"
          >
            <span className="text-white">
              🎉 {winner} 🎉
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinTheWheel;
