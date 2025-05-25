// import React, { useState, Children, cloneElement } from "react";
// import { motion } from "framer-motion";

// type CardStackProps = {
//   children: React.ReactNode;
// };

// export const CardStack: React.FC<CardStackProps> = ({ children }) => {
//   const [cards, setCards] = useState(Children.toArray(children));

//   const handleSelect = (index: number) => {
//     const selected = cards[index];

//     // Remove selected card from stack
//     setCards((prev) => prev.filter((_, i) => i !== index));

//     // You can pass selected somewhere or trigger modal etc.
//     console.log("Selected card:", selected);
//   };

//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {cards.map((child, index) => {
//         const angle = index * 12; // spiral effect: increase rotation
//         const offset = index * 6; // spiral effect: increase spacing

//         return (
//           <motion.div
//             key={index}
//             onClick={() => handleSelect(index)}
//             className="absolute cursor-pointer"
//             style={{
//               transform: `rotate(${angle}deg) translate(${offset}px, ${offset}px)`,
//               zIndex: cards.length - index,
//             }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {cloneElement(child as React.ReactElement)}
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// import React, { useState, Children, cloneElement } from "react";
// import { motion } from "framer-motion";

// type CardStackProps = {
//   children: React.ReactNode;
// };

// export const CardStack: React.FC<CardStackProps> = ({ children }) => {
//   const [cards, setCards] = useState(Children.toArray(children));

//   const handleSelect = () => {
//     setCards((prev) => prev.slice(1));
//   };

//   return (
//     <div className="relative w-full h-full flex items-center justify-center">
//       {cards.map((child, index) => {
//         const isTop = index === 0;

//         // Fan effect (spread like a deck of cards)
//         const angle = (index - cards.length / 2) * 5;
//         const xOffset = (index - cards.length / 2) * 8;
//         const yOffset = (index - cards.length / 2) * 2;

//         return (
//           <motion.div
//             key={index}
//             className="absolute"
//             style={{
//               transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,
//               zIndex: isTop ? cards.length : index,
//               pointerEvents: isTop ? "auto" : "none",
//               opacity: isTop ? 1 : 0.7,
//               scale: isTop ? 1 : 0.96,
//               transition: "all 0.3s ease",
//             }}
//             whileHover={isTop ? { scale: 1.05 } : {}}
//             whileTap={isTop ? { scale: 0.95 } : {}}
//             onClick={isTop ? handleSelect : undefined}
//           >
//             {cloneElement(child as React.ReactElement)}
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

import React, { useState, Children, cloneElement } from "react";
import { motion } from "framer-motion";

type CardStackProps = {
  children: React.ReactNode;
};

export const CardStack: React.FC<CardStackProps> = ({ children }) => {
  const [cards, setCards] = useState(Children.toArray(children));

  const handleSelect = () => {
    // Remove the top card (first one)
    setCards((prev) => prev.slice(1));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {cards.map((child, index) => {
        const isTop = index === 0;

        // Spiral effect: each card is rotated and offset more than the next
        const angle = index * 10; // Increase angle for spiral
        const radius = index * 8; // Distance from center
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
              zIndex: isTop ? cards.length : index,
              pointerEvents: isTop ? "auto" : "none",
              opacity: isTop ? 1 : 0.6,
              scale: isTop ? 1 : 0.95,
              transition: "all 0.3s ease",
            }}
            whileHover={isTop ? { scale: 1.05 } : {}}
            whileTap={isTop ? { scale: 0.95 } : {}}
            onClick={isTop ? handleSelect : undefined}
          >
            {cloneElement(child as React.ReactElement)}
          </motion.div>
        );
      })}
    </div>
  );
};
