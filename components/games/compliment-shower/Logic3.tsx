"use client";

import React, { useEffect, useRef, useState, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const compliments = [
  "You're amazing!",
  "Great job!",
  "You're a star!",
  "Keep it up!",
  "You're doing great!",
  "Wonderful work!",
  "So proud of you!",
  "You're awesome!",
  "Fantastic!",
];

// Game configuration constants
const DROP_INTERVAL = 1000;
const DROP_SPEED_RATIO = 0.008;
const JAR_WIDTH_RATIO = 0.35;
const DROP_SIZE_RATIO = 0.15;

interface Drop {
  id: number;
  xRatio: number;
  yRatio: number;
}

const Drop = ({ drop, size }: { drop: Drop; size: number }): ReactElement => (
  <motion.div
    className="absolute"
    style={{
      left: `${drop.xRatio * 100}%`,
      top: `${drop.yRatio * 100}%`,
      width: size,
      height: size,
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Image 
      src="/assets/drop.png" 
      alt="Falling compliment drop" 
      width={size}
      height={size}
      className="w-full h-full object-contain"
    />
  </motion.div>
);

const Jar = ({ x, width }: { x: number; width: number }): ReactElement => (
  <motion.div
    className="absolute bottom-4 h-16"
    style={{
      width: width,
      left: x,
    }}
  >
    <Image 
      src="/assets/jar.png" 
      alt="Catching jar" 
      width={width}
      height={64}
      className="w-full h-full object-contain"
    />
  </motion.div>
);

export default function ComplimentShower(): ReactElement | null {
  // Game state
  const [hasMounted, setHasMounted] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [jarXRatio, setJarXRatio] = useState(0.5);
  const [score, setScore] = useState(0);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  // Refs for game mechanics
  const dropId = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const complimentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(0);
  const jarMovementRef = useRef<number>(0.5);

  // Throttled jar movement
  const setJarPosition = (newRatio: number): void => {
    const now = Date.now();
    if (now - lastTimeRef.current > 16) {
      jarMovementRef.current = newRatio;
      setJarXRatio(newRatio);
      lastTimeRef.current = now;
    }
  };

  // Initialize game
  useEffect(() => {
    setHasMounted(true);
    jarMovementRef.current = jarXRatio;
    
    const updateSize = (): void => {
      if (typeof window !== 'undefined') {
        setViewport({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        });
      }
    };
    
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Drop generation
  useEffect(() => {
    if (!playing || !viewport.width) return;
    
    const interval = setInterval(() => {
      setDrops((prev) => [
        ...prev,
        {
          id: dropId.current++,
          xRatio: Math.random(),
          yRatio: 0,
        },
      ]);
    }, DROP_INTERVAL);
    
    return () => clearInterval(interval);
  }, [playing, viewport.width]);

  // Pause the game when the tab is not in view
  useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      setPlaying(false);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);

  // Game animation loop
  useEffect(() => {
    if (!playing) return;

    const animate = (): void => {
      setDrops((prev) => {
        return prev
          .map((drop) => ({ 
            ...drop, 
            yRatio: drop.yRatio + DROP_SPEED_RATIO 
          }))
          .filter((drop) => {
            const dropX = drop.xRatio * viewport.width;
            const dropY = drop.yRatio * viewport.height;
            const jarX = jarXRatio * viewport.width;
            const jarWidth = viewport.width * JAR_WIDTH_RATIO;
            
            const caught =
              dropY > viewport.height - 100 &&
              dropX >= jarX - jarWidth * 0.2 &&
              dropX <= jarX + jarWidth * 1.2;
            
            if (caught) {
              setScore((s) => s + 1);
              setCompliment(
                compliments[Math.floor(Math.random() * compliments.length)]
              );
              if (complimentTimeoutRef.current) {
                clearTimeout(complimentTimeoutRef.current);
              }
              complimentTimeoutRef.current = setTimeout(
                () => setCompliment(null), 
                2000
              );
            }
            return dropY < viewport.height && !caught;
          });
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [jarXRatio, playing, viewport]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!playing) return;
      
      const delta = 0.08;
      const currentRatio = jarMovementRef.current;
      
      if (e.key === "ArrowLeft") {
        setJarPosition(Math.max(-JAR_WIDTH_RATIO/2, currentRatio - delta));
      } else if (e.key === "ArrowRight") {
        setJarPosition(Math.min(1 - JAR_WIDTH_RATIO/2, currentRatio + delta));
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing]);

  // Touch controls
  const handleTouchMove = (e: React.TouchEvent): void => {
    if (!playing) return;
    const touchX = e.touches[0].clientX;
    const ratio = touchX / viewport.width;
    setJarPosition(
      Math.min(1 - JAR_WIDTH_RATIO/2, Math.max(-JAR_WIDTH_RATIO/2, ratio - JAR_WIDTH_RATIO / 2))
    );
  };

  if (!hasMounted || viewport.width === 0) return null;

  const jarWidth = viewport.width * JAR_WIDTH_RATIO;
  const dropSize = Math.min(viewport.width, viewport.height) * DROP_SIZE_RATIO;
  const jarX = jarXRatio * viewport.width;

  return (
    <div
      className="relative w-full h-screen overflow-hidden touch-none color-E0ffff"
      style={{
        backgroundImage: "url(/assets/background2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10 w-full h-full">
        <div className="absolute top-4 left-4 text-lg font-bold text-white bg-black bg-opacity-50 px-3 py-1 rounded">
          Score: {score}
        </div>
        
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => setPlaying((p) => !p)}
            className="bg-white bg-opacity-80 hover:bg-opacity-100 px-4 py-1 rounded font-medium transition-all"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <AnimatePresence>
          {compliment && (
            <motion.div
              className="absolute top-16 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white bg-pink-500 bg-opacity-80 px-4 py-2 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {compliment}
            </motion.div>
          )}
        </AnimatePresence>

        {drops.map((drop) => (
          <Drop key={drop.id} drop={drop} size={dropSize} />
        ))}

        <Jar x={jarX} width={jarWidth} />
      </div>
    </div>
  );
}