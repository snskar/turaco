import React from 'react';
import { motion } from 'framer-motion';
import TwinklingStars from '@/components/ui/TwinklingStars';

const KawaiiBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Background wrapper - fixed position */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.2) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {/* Animated Clouds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-24 h-16 bg-white/30 rounded-full blur-sm"
            animate={{
              x: ['-100%', '100%'],
              y: ['0%', '5%', '0%']
            }}
            transition={{
              x: { duration: 20, repeat: Infinity, ease: 'linear' },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ top: '15%', left: '-10%' }}
          />
          <motion.div
            className="absolute w-32 h-20 bg-white/20 rounded-full blur-sm"
            animate={{
              x: ['100%', '-100%'],
              y: ['0%', '-7%', '0%']
            }}
            transition={{
              x: { duration: 25, repeat: Infinity, ease: 'linear' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ top: '40%', right: '-10%' }}
          />
          <motion.div
            className="absolute w-28 h-16 bg-white/25 rounded-full blur-sm"
            animate={{
              x: ['-100%', '100%'],
              y: ['0%', '3%', '0%']
            }}
            transition={{
              x: { duration: 22, repeat: Infinity, ease: 'linear' },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
            }}
            style={{ top: '65%', left: '-10%' }}
          />
        </div>

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + (i % 2),
                repeat: Infinity,
                delay: i * 0.1
              }}
              style={{
                left: `${(i * 13 + 7) % 100}%`,
                top: `${(i * 17 + 3) % 100}%`
              }}
            />
          ))}
        </div>
      </div>

            {/* Star field layer */}
            <TwinklingStars starCount={75} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default KawaiiBackground; 