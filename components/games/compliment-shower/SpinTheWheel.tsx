"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface SpinTheWheelProps {
  options: string[];
  centerImageSrc: string;
}

const SpinTheWheel: React.FC<SpinTheWheelProps> = ({ options, centerImageSrc }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  const size = 300;
  const radius = size / 2;
  const sectorAngle = 360 / options.length;
  const totalSectors = options.length;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const spins = 5; // 5 full spins for excitement
    const randomSectorIndex = Math.floor(Math.random() * totalSectors);
    const finalRotation =
      360 * spins + (360 - randomSectorIndex * sectorAngle - sectorAngle / 2);

    // Animate spin
    if (wheelRef.current) {
      wheelRef.current.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    setTimeout(() => {
      // Compute the final rotation relative to the current sector
      const normalizedRotation = finalRotation % 360;
      // Determine which sector is at the top (aligned with the triangle)
      const sectorAtTop = Math.floor(
        (360 - normalizedRotation + sectorAngle / 2) / sectorAngle
      ) % totalSectors;

      const winningOption = options[sectorAtTop];
      setWinner(winningOption);
      triggerConfetti();
      setIsSpinning(false);
    }, 4000);
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const renderSectors = () => {
    return options.map((option, i) => {
      const startAngle = i * sectorAngle;
      const endAngle = startAngle + sectorAngle;
      const largeArcFlag = sectorAngle > 180 ? 1 : 0;

      const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

      const pathData = `
        M ${radius} ${radius}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      // Position text at the middle of the sector
      const textAngle = startAngle + sectorAngle / 2;
      const textRadius = radius * 0.75;
      const textX = radius + textRadius * Math.cos((textAngle * Math.PI) / 180);
      const textY = radius + textRadius * Math.sin((textAngle * Math.PI) / 180);

      return (
        <g key={i}>
          <path
            d={pathData}
            fill={i % 2 === 0 ? "#FF6B6B" : "#FFD93D"}
            stroke="#fff"
            strokeWidth="1"
          />
          <text
            x={textX}
            y={textY}
            fill="#333"
            fontSize="10"
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            {option}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Indicator Triangle */}
      <div
        style={{
          position: "absolute",
          top: size / 2 - 10,
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "20px solid #333", // Point downwards
          zIndex: 10,
        }}
      />

      {/* Wheel */}
      <svg
        ref={wheelRef}
        width={size}
        height={size}
        style={{
          borderRadius: "50%",
        }}
      >
        {renderSectors()}

        {/* Center Image */}
        <defs>
          <clipPath id="circleView">
            <circle cx={radius} cy={radius} r={radius * 0.3} />
          </clipPath>
        </defs>
        <image
          href={centerImageSrc}
          x={radius - radius * 0.3}
          y={radius - radius * 0.3}
          width={radius * 0.6}
          height={radius * 0.6}
          clipPath="url(#circleView)"
        />
      </svg>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="mt-4 px-4 py-2 rounded bg-blue-500 text-white disabled:bg-gray-400"
      >
        {isSpinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      {winner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mt-4 text-xl font-bold text-green-600"
        >
          🎉 Winner: {winner} 🎉
        </motion.div>
      )}
    </div>
  );
};

export default SpinTheWheel;
