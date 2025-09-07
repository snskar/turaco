'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import HolographicText from '../HolographicText';
import OptimizedImage from '../OptimizedImage';
import { SplashTitleProps } from './types';
import TextBox from '../TextBox';

const SplashTitle: React.FC<SplashTitleProps> = ({
  title,
  name,
  message,
  className,
  imgSource,
}) => {
  return (
    <motion.div
      className={cn(
        'flex flex-col justify-center',
        'relative w-full max-w-4xl mx-auto',
        'py-8 px-6',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main content wrapper with relative positioning */}
      <div className="relative">
        {/* Title Group */}
        <div className="relative z-10">
          {/* Background glow for the text group */}
          <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full transform" />

          {/* Main Title */}
          <div className="relative z-10">
            <HolographicText
              // className="text-[5px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.1]"
              className="text-[50px] sm:text-[40px] md:text-[40px] lg:text-[36px] leading-[1]"
              strokeWidth={8}
            >
              {title}
            </HolographicText>
          </div>
        </div>

        {/* Cat artwork - positioned behind text */}
        <motion.div
          className="absolute -top-4 -right-4 w-40 sm:w-48 md:w-56 h-48 sm:h-64 md:h-56 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <OptimizedImage
            src={imgSource || '/assets/art/cat.png'}
            alt="Decorative symbol"
            width={800}
            height={800}
            className="object-contain drop-shadow-lg"
            useCloudinary={true}
          />
        </motion.div>

        {/* Name and Message Group */}
        <div className="relative z-30">
          {/* Name */}
          {name && (
            <motion.div
              className="relative mt-2"
              initial={{ y: 0 }}
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <motion.div
                className="absolute inset-0 bg-purple-500/5 blur-xl rounded-3xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <HolographicText
                className="text-[60px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.1]"
                strokeWidth={8}
              >
                {`${name}!!`}
              </HolographicText>
            </motion.div>
          )}

          {/* Message with softer appearance */}
          {message && (
            <motion.div
              className={cn(
                'text-base sm:text-lg md:text-xl',
                'text-white/90 font-medium mt-4',
                'max-w-4xl mx-auto',
                'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]',
                'text-justify'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TextBox>{message}</TextBox>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${15 + i * 20}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  );
};

export default SplashTitle;
