import React from 'react';
import { cn } from '@/lib/utils';

interface TextBoxProps {
  children: React.ReactNode;
  className?: string;
}

const TextBox: React.FC<TextBoxProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'relative p-6 rounded-[2rem] inline-block',
        'bg-gradient-to-br from-blue-400/40 via-purple-400/40 to-pink-400/40',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* White border container */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/80" />

      {/* Content */}
      <div className="relative text-white text-justify font-semibold text-lg">
        {children}
      </div>

      {/* Cloud decorations */}
      <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/30 rounded-full blur-lg" />
      <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-white/20 rounded-full blur-lg" />
    </div>
  );
};

export default TextBox;
