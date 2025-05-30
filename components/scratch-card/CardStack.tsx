import React, { useState, Children, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScratchCardProps } from "./types";


type CardStackProps = {
  children: React.ReactElement<ScratchCardProps>[];
  onCardComplete?: (index: number) => void;
};

export const CardStack: React.FC<CardStackProps> = ({ children, onCardComplete }) => {
  const [cards, setCards] = useState(Children.toArray(children));
  const [isProcessing, setIsProcessing] = useState(false);
  const [scratchedIndex, setScratchedIndex] = useState<number | null>(null);

  const handleTopCardComplete = () => {
    if (isProcessing) return;
    setScratchedIndex(0);
    setIsProcessing(true);
    
    setTimeout(() => {
      setCards((prev) => {
        const newCards = [...prev];
        newCards.shift();
        return newCards;
      });

      setScratchedIndex(null);
      onCardComplete?.(cards.length - 1);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {cards.map((child, index) => {
          const isTopCard = index === 0;
          const isScratched = index === scratchedIndex;
          
          // Spiral effect calculations
          const angle = index * 10;
          const radius = index * 8;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={`card-${index}`}
              className={`absolute ${isTopCard && !isProcessing ? 'cursor-pointer' : 'pointer-events-none'}`}
              style={{
                zIndex: cards.length - index,
              }}
              initial={{ 
                opacity: 1, 
                scale: 0.95,
                x,
                y,
                rotate: angle 
              }}
              animate={{ 
                opacity: isTopCard ? 1 : 0.6,
                scale: isTopCard ? 1 : 0.95,
                x,
                y,
                rotate: angle,
                transition: { duration: 0.3 }
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                x: x + 50,
                y: y - 50,
                rotate: angle + 15,
                transition: { duration: 0.3 }
              }}
              whileHover={isTopCard && !isProcessing ? { scale: 1.05 } : undefined}
              whileTap={isTopCard && !isProcessing ? { scale: 0.95 } : undefined}
            >
              {cloneElement(child as React.ReactElement<ScratchCardProps>, {
                onComplete: isTopCard ? handleTopCardComplete : undefined,
                isInteractive: isTopCard && !isProcessing,
                isScratched: isScratched
              })}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};