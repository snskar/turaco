import React, { ReactElement } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Drop {
  id: number;
  xRatio: number;
  yRatio: number;
}

export const Drop = ({ drop, size }: { drop: Drop; size: number }): ReactElement => (
  <motion.div
    className="absolute"
    style={{
      left: `${drop.xRatio * 100}%`,
      top: `${drop.yRatio * 100}%`,
      width: size,
      height: size,
    }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Image 
      src="/assets/drop.png" 
      alt="Falling compliment drop" 
      width={size}
      height={size}
      className="w-full h-full object-contain"
    />
  </motion.div>
);