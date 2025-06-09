import React from 'react';
import { motion } from 'framer-motion';
import TwinklingStars from './TwinklingStars';

const HolographicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="fixed inset-0 w-full h-full">
        {/* Dark base layer */}
        <div className="absolute inset-0 bg-[#0a0a1f]" />

        {/* Deep base gradient with strong pink/cyan */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#1a4a7c] via-[#4a1155] to-[#1a4a7c] opacity-80"
          style={{
            backgroundSize: '400% 400%',
          }}
          animate={{
            backgroundImage: [
              'linear-gradient(45deg, #1a4a7c 0%, #4a1155 50%, #1a4a7c 100%)',
              'linear-gradient(45deg, #2b1f4d 0%, #4a1155 50%, #1a3c6e 100%)',
              'linear-gradient(45deg, #1a4a7c 0%, #4a1155 50%, #1a4a7c 100%)',
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Iridescent overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(60deg, rgba(64,190,244,0.1), rgba(225,125,220,0.1), rgba(144,238,188,0.08), rgba(255,179,123,0.08))',
            backgroundSize: '300% 300%',
            mixBlendMode: 'screen',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Holographic rainbow bands */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0) 40px)',
            backgroundSize: '200% 200%',
            mixBlendMode: 'soft-light',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 200%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Multiple color spots */}
        {[
          { color: 'rgba(64,190,244,0.15)', position: '30% 30%' },
          { color: 'rgba(225,125,220,0.15)', position: '70% 60%' },
          { color: 'rgba(144,238,188,0.12)', position: '20% 70%' },
          { color: 'rgba(255,179,123,0.12)', position: '80% 40%' },
          { color: 'rgba(180,130,255,0.15)', position: '50% 20%' },
          { color: 'rgba(130,255,230,0.12)', position: '40% 80%' }
        ].map((spot, i) => (
          <motion.div
            key={`spot-${i}`}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${spot.position}, ${spot.color} 0%, transparent 50%)`,
              filter: 'blur(90px)',
            }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Soft shimmer bands with color variations */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`band-${i}`}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${45 + i * 30}deg, 
                transparent 0%,
                rgba(255,255,255,${0.02 + i * 0.01}) 25%,
                rgba(${180 + i * 20},${130 + i * 30},${255 - i * 20},${0.03 + i * 0.01}) 50%,
                rgba(255,255,255,${0.02 + i * 0.01}) 75%,
                transparent 100%
              )`,
              backgroundSize: '200% 200%',
              mixBlendMode: 'soft-light',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 200%'],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Enhanced bokeh sparkles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${3 + Math.random() * 8}px`,
              height: `${3 + Math.random() * 8}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `rgba(${180 + Math.random() * 75},${130 + Math.random() * 125},${230 + Math.random() * 25},0.15)`,
              filter: 'blur(1px)',
              opacity: 0.4,
            }}
            animate={{
              opacity: [0.15, 0.4, 0.15],
              scale: [1, 1.5, 1],
              filter: ['blur(1px)', 'blur(2px)', 'blur(1px)'],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 4,
            }}
          />
        ))}

        {/* Gentle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.15] mix-blend-soft-light pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Iridescent center highlight */}
        <motion.div 
          className="absolute inset-0 mix-blend-soft-light opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 70%)'
          }}
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(180,130,255,0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(130,255,230,0.2) 0%, transparent 70%)',
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25) 0%, transparent 70%)',
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Star field layer */}
      <TwinklingStars starCount={75} />

      {/* Foreground */}
      <div className="relative z-10 text-white">
        {children}
      </div>
    </div>
  );
};

export default HolographicBackground;
