'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScratchCard from './Card';
import { AnimatedImageButton } from '@/components/ui/AnimatedImageButton';
import { CardStackProps } from './types';

export const CardStack: React.FC<CardStackProps> = React.memo(({ cards }) => {
  const [remainingCards, setRemainingCards] = useState<string[]>(cards);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scratchedIndex, setScratchedIndex] = useState<number | null>(null);

  const handleTopCardComplete = () => {
    if (isProcessing) return;
    setScratchedIndex(0);
    setIsProcessing(true);

    const revealedCard = remainingCards[0];
    if (revealedCard) {
      setTimeout(() => {
        setRemainingCards(prev => prev.slice(1));
        setRevealedCards(prev => [...prev, revealedCard]);
        setScratchedIndex(null);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setRemainingCards(cards);
    setRevealedCards([]);
    setScratchedIndex(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence>
          {remainingCards.length > 0 ? (
            remainingCards.map((revealText, index) => {
              const isTopCard = index === 0;
              const isScratched = index === scratchedIndex;

              // Spiral effect calculations
              const angle = index * 10;
              const radius = index * 8;
              const x = radius * Math.cos((angle * Math.PI) / 180);
              const y = radius * Math.sin((angle * Math.PI) / 180);

              return (
                <motion.div
                  key={`card-${index}-${revealText}`}
                  className={`absolute ${isTopCard && !isProcessing ? 'cursor-pointer' : 'pointer-events-none'}`}
                  style={{
                    zIndex: remainingCards.length - index,
                  }}
                  initial={{
                    opacity: 1,
                    scale: 0.95,
                    x,
                    y,
                    rotate: angle,
                  }}
                  animate={{
                    opacity: isTopCard ? 1 : 0.6,
                    scale: isTopCard ? 1 : 0.95,
                    x,
                    y,
                    rotate: angle,
                    transition: { duration: 0.3 },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: x + 50,
                    y: y - 50,
                    rotate: angle + 15,
                    transition: { duration: 0.3 },
                  }}
                  whileHover={
                    isTopCard && !isProcessing ? { scale: 1.05 } : undefined
                  }
                  whileTap={
                    isTopCard && !isProcessing ? { scale: 0.95 } : undefined
                  }
                >
                  <ScratchCard
                    text="Scratch Me!"
                    revealText={revealText}
                    onComplete={isTopCard ? handleTopCardComplete : undefined}
                    isInteractive={isTopCard && !isProcessing}
                    isScratched={isScratched}
                  />
                </motion.div>
              );
            })
          ) : (
            <AnimatedImageButton
              src="/assets/ui/replay.png"
              alt="Play Again"
              width={200}
              height={200}
              onClick={handleReset}
              rotateOnHover={true}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Revealed Cards List */}
      <AnimatePresence>
        {revealedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            <div className="flex flex-col items-center gap-2 p-6 rounded-xl bg-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2">Truth!</h3>
              {revealedCards.map((card, index) => (
                <motion.div
                  key={`revealed-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-lg text-white/90"
                >
                  {card}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

CardStack.displayName = 'CardStack';
