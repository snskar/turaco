import React from 'react';
import HolographicText from '../HolographicText';
import { motion } from 'framer-motion';
import { ComponentHeaderProps } from './types';

export const ComponentHeader: React.FC<ComponentHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="w-full px-6">
            <motion.div 
                className="text-2xl md:text-4xl font-extrabold text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="text-center">
                    <HolographicText strokeWidth={2}>{title}</HolographicText>
                </div>
                {subtitle && (
                    <div className="text-lg md:text-xl -mt-1 text-white font-semibold text-center">
                        {subtitle}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
