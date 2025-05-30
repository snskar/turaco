"use client";

import React, { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drop } from './Drop';
import { Jar } from './Jar';
import { Play } from './Play';
import { COMPLIMENTS } from './constants';
import {
  useGameState,
  useGameRefs,
  useJarMovement,
  useGameInitialization,
  useDropGeneration,
  useVisibilityPause,
  useGameAnimation,
  useKeyboardControls,
  useTouchControls
} from './hooks';

export default function ComplimentShower(): ReactElement | null {
  // Game state using custom hooks
  const {
    hasMounted,
    setHasMounted,
    drops,
    setDrops,
    jarXRatio,
    setJarXRatio,
    score,
    setScore,
    compliment,
    setCompliment,
    playing,
    setPlaying,
    viewport,
    setViewport
  } = useGameState();

  // Game refs using custom hook
  const {
    dropId,
    animationFrameRef,
    complimentTimeoutRef,
    lastTimeRef,
    jarMovementRef
  } = useGameRefs();

  // Jar movement control
  const setJarPosition = useJarMovement(
    lastTimeRef,
    jarMovementRef,
    setJarXRatio
  );

  // Initialize game
  useGameInitialization(
    setHasMounted,
    jarMovementRef,
    jarXRatio,
    setViewport
  );

  // Drop generation
  useDropGeneration(
    playing,
    viewport,
    dropId,
    setDrops
  );

  // Visibility pause
  useVisibilityPause(setPlaying);

  // Game animation
  useGameAnimation(
    playing,
    viewport,
    jarXRatio,
    setDrops,
    setScore,
    setCompliment,
    COMPLIMENTS,
    complimentTimeoutRef,
    animationFrameRef
  );

  // Keyboard controls
  useKeyboardControls(
    playing,
    jarMovementRef,
    setJarPosition
  );

  // Touch controls
  const handleTouchMove = useTouchControls(
    playing,
    viewport,
    setJarPosition
  );

  if (!hasMounted || viewport.width === 0) return null;

  const jarX = jarXRatio * (viewport.width - 80); // 80 is JAR_SIZE.width

  return (
    <div
      className="relative w-full h-[90vh] overflow-hidden touch-none"
      onClick={() => setPlaying(!playing)}
      onTouchMove={handleTouchMove}
      onTouchStart={(e) => e.preventDefault()}
    >
      <AnimatePresence>
        {drops.map((drop) => (
          <Drop key={drop.id} drop={drop} />
        ))}
      </AnimatePresence>

      <Jar x={jarX} />

      {compliment && (
        <motion.div
          className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-2xl md:text-4xl font-bold text-white text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          {compliment}
        </motion.div>
      )}

      <div className="absolute top-4 right-4 text-xl md:text-2xl font-bold text-white">
        Score: {score}
      </div>

      {!playing && (

        <div className="flex-col absolute inset-0 flex items-center justify-center">
          <Play/>
        <div 
          className="flex-col flex items-center justify-center"
        >
          <motion.div 
            className="text-white text-xl md:text-3xl font-bold text-center p-4 rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {score > 0 ? "Game Paused" : "Tap to Start"}
            <div className="text-sm md:text-base mt-2">
              Use arrow keys or touch to move the jar
            </div>
          </motion.div>
        </div>
        </div>
      )}
    </div>
  );
}
