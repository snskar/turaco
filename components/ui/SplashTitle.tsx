import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplashTitleProps {
  title: string;
  name?: string;
  message?: string;
  className?: string;
}

const SplashTitle: React.FC<SplashTitleProps> = ({
  title,
  name,
  message,
  className
}) => {
  return (
    <motion.div 
      className={cn(
        "flex flex-col items-center justify-center text-center gap-4 p-6 relative",
        "bg-gradient-to-b from-purple-500/10 to-transparent",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Title with shadow effect */}
      <motion.h1 
        className="text-7xl md:text-6xl font-extrabold text-white relative drop-shadow-[0_4px_8px_rgba(93,63,211,0.3)]"
        style={{
          textShadow: `
            4px 4px 0px rgba(93, 63, 211, 0.7),
            -2px -2px 0px rgba(93, 63, 211, 0.7),
            2px -2px 0px rgba(93, 63, 211, 0.7),
            -2px 2px 0px rgba(93, 63, 211, 0.7)
          `
        }}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
      >
        {title}
      </motion.h1>

      {/* Name with larger size */}
      {name && (
        <motion.h2 
          className="text-6xl md:text-5xl font-bold text-white mt-2 drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {name}
        </motion.h2>
      )}

      {/* Message with softer appearance */}
      {message && (
        <motion.p 
          className="text-xl md:text-2xl text-white/90 mt-2 max-w-2xl font-medium drop-shadow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
      
      <motion.div 
        className="absolute top-1/4 -right-2 text-lg text-white opacity-50"
        animate={{ y: [-4, 4, -4] }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        •
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 -left-2 text-lg text-white opacity-50"
        animate={{ y: [4, -4, 4] }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        •
      </motion.div>

      {/* Cloud decorations */}
      <div className="absolute -bottom-8 left-0 w-24 h-12 bg-pink-200/30 rounded-full blur-xl" />
      <div className="absolute -bottom-8 right-0 w-32 h-12 bg-pink-200/30 rounded-full blur-xl" />
    </motion.div>
  );
};

export default SplashTitle; 