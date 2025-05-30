"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpinTheWheel } from "./utils";
import TextBox from "@/components/ui/TextBox";

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
      {/* Fixed pointer triangle at top */}
      <div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
        style={{
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '25px solid rgba(165, 180, 252, 0.9)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />

      {/* Wheel Container */}
      <div 
        className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 shadow-xl cursor-pointer"
        onClick={!isSpinning ? spin : undefined}
      >
        <svg
          ref={wheelRef}
          width={wheelSize}
          height={wheelSize}
          className="transition-transform duration-100"
          style={{
            borderRadius: '50%',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          }}
        >
          {renderSectors().map((sector, i) => (
            <g key={i}>
              <path
                d={sector.pathData}
                fill={i % 2 === 0 ? 'rgba(255, 214, 235, 0.9)' : 'rgba(214, 245, 255, 0.9)'}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="1"
                className="transition-colors duration-200 hover:brightness-105"
              />
              <text
                x={sector.textX}
                y={sector.textY}
                fill="#4a5568"
                fontSize={sector.fontSize}
                fontWeight="600"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`
                  rotate(${sector.textRotation}, ${sector.textX}, ${sector.textY})
                `}
                style={{
                  filter: 'drop-shadow(1px 1px 1px rgba(255,255,255,0.5))'
                }}
              >
                {sector.option}
              </text>
            </g>
          ))}

          {/* Center Image */}
          <defs>
            <clipPath id="circleView">
              <circle cx={radius} cy={radius} r={radius * 0.28} />
            </clipPath>
          </defs>
          <circle 
            cx={radius} 
            cy={radius} 
            r={radius * 0.28} 
            fill="rgba(255, 255, 255, 0.3)"
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
        </svg>
      </div>

      {/* Winner Display */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-xl font-bold text-white text-center p-4 rounded-lg
                     bg-white/20 backdrop-blur-sm shadow-lg"
          >
            🎉 {winner} 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinTheWheel;
