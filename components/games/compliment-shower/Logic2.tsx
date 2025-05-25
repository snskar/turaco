"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const DROP_INTERVAL = 1000;
const DROP_SPEED_RATIO = 0.01;
const JAR_WIDTH_RATIO = 0.15;
const DROP_SIZE_RATIO = 0.04;

interface Drop {
  id: number;
  xRatio: number;
  yRatio: number;
}

export default function ComplimentShower() {
  const [hasMounted, setHasMounted] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [jarXRatio, setJarXRatio] = useState(0.5);
  const [score, setScore] = useState(0);
  const [compliment, setCompliment] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const dropId = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const complimentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setViewport({ width: offsetWidth, height: offsetHeight });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!playing || !viewport.width) return;
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

  useEffect(() => {
    const animate = () => {
      setDrops((prev) => {
        return prev
          .map((drop) => ({ ...drop, yRatio: drop.yRatio + DROP_SPEED_RATIO }))
          .filter((drop) => {
            const dropX = drop.xRatio * viewport.width;
            const dropY = drop.yRatio * viewport.height;
            const jarX = jarXRatio * viewport.width;
            const jarWidth = viewport.width * JAR_WIDTH_RATIO;
            const caught =
              dropY > viewport.height - 80 &&
              dropX >= jarX &&
              dropX <= jarX + jarWidth;
            if (caught) {
              setScore((s) => s + 1);
              setCompliment(
                compliments[Math.floor(Math.random() * compliments.length)]
              );
              if (complimentTimeoutRef.current)
                clearTimeout(complimentTimeoutRef.current);
              complimentTimeoutRef.current = setTimeout(
                () => setCompliment(null),
                2000
              );
            }
            return dropY < viewport.height - 20 && !caught;
          });
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [jarXRatio, playing, viewport]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playing) return;
      setJarXRatio((x) => {
        const delta = 0.05;
        if (e.key === "ArrowLeft") return Math.max(0, x - delta);
        if (e.key === "ArrowRight") return Math.min(1 - JAR_WIDTH_RATIO, x + delta);
        return x;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing]);

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const ratio = touchX / viewport.width;
    setJarXRatio(
      Math.min(1 - JAR_WIDTH_RATIO, Math.max(0, ratio - JAR_WIDTH_RATIO / 2))
    );
  };

  if (!hasMounted || viewport.width === 0) return null;

  const jarWidth = viewport.width * JAR_WIDTH_RATIO;
  const dropSize = viewport.width * DROP_SIZE_RATIO;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[600px] aspect-[9/16] mx-auto bg-cover bg-center rounded-xl overflow-hidden touch-none"
      style={{
        backgroundImage: "url(/assets/bg.jpg)",
      }}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-2 left-2 text-xs md:text-base font-bold text-white drop-shadow">
        Score: {score}
      </div>
      <div className="absolute top-2 right-2 z-10">
        <button
          className="text-xs md:text-sm bg-white/70 px-2 py-1 rounded-md"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <AnimatePresence>
        {compliment && (
          <motion.div
            className="absolute top-10 left-1/2 transform -translate-x-1/2 text-sm md:text-xl font-semibold text-pink-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {compliment}
          </motion.div>
        )}
      </AnimatePresence>

      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.xRatio * 100}%`,
            top: `${drop.yRatio * 100}%`,
            width: dropSize,
            height: dropSize,
            backgroundImage: "url(/assets/drop.jpeg)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}

      <motion.div
        className="absolute bottom-4 h-12"
        style={{
          width: jarWidth,
          left: jarXRatio * viewport.width,
          backgroundImage: "url(/assets/jar.png)",
          backgroundSize: "cover",
          height: `${jarWidth * 1.2}px`,
        }}
      />
    </div>
  );
}
