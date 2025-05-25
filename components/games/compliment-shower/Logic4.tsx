/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  text?: string;
  revealText?: string;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 300,
  height = 150,
  coverColor = '#C0C0C0',
  text = 'Scratch Me!',
  revealText = 'You Won! 🎉',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'destination-out';

    const scratchHandler = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
      const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
    };
    


    const touchMove = (e: TouchEvent) => {
      e.preventDefault();
      scratchHandler(e);
      checkScratchCompletion();
    };

    const mouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      scratchHandler(e);
      checkScratchCompletion();
    };

    canvas.addEventListener('touchmove', touchMove);
    canvas.addEventListener('mousemove', mouseMove);

    return () => {
      canvas.removeEventListener('touchmove', touchMove);
      canvas.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect( () => {
    if(isScratched){
        confetti();
      }
    }, [isScratched]);

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;

    for (let i = 3; i < pixels.data.length; i += 4) {
      if (pixels.data[i] < 128) transparentPixels++;
    }

    const transparency = transparentPixels / (canvas.width * canvas.height);
    if (transparency > 0.5 && !isScratched) {
      setIsScratched(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // confetti();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg"
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-white z-0 flex items-center justify-center text-center px-4 text-black text-lg font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScratched ? 1 : 0 }}
      >
        {revealText}
      </motion.div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <span className="text-black text-lg font-bold pointer-events-none">
          {text}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 touch-none rounded-2xl"
      />
    </div>
  );
};

export default ScratchCard;
