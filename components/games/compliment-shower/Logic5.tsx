// import React, { useRef, useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import confetti from 'canvas-confetti';

// interface ScratchCardProps {
//   width?: number;
//   height?: number;
//   coverColor?: string;
//   text?: string;
//   revealText?: string;
// }

// const ScratchCard: React.FC<ScratchCardProps> = ({
//   width = 300,
//   height = 150,
//   coverColor = '#C0C0C0',
//   text = 'Scratch Me!',
//   revealText = 'You Won! 🎉',
// }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isScratched, setIsScratched] = useState(false);
//   const [cleared, setCleared] = useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     canvas.width = width;
//     canvas.height = height;

//     ctx.fillStyle = coverColor;
//     ctx.fillRect(0, 0, width, height);
//     ctx.globalCompositeOperation = 'destination-out';

//     const scratchHandler = (e: TouchEvent | MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
//       const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

//       ctx.beginPath();
//       ctx.arc(x, y, 20, 0, 2 * Math.PI);
//       ctx.fill();
//     };

//     const touchMove = (e: TouchEvent) => {
//       e.preventDefault();
//       scratchHandler(e);
//       checkScratchCompletion();
//     };

//     const mouseMove = (e: MouseEvent) => {
//       if (e.buttons !== 1) return;
//       scratchHandler(e);
//       checkScratchCompletion();
//     };

//     canvas.addEventListener('touchmove', touchMove);
//     canvas.addEventListener('mousemove', mouseMove);

//     return () => {
//       canvas.removeEventListener('touchmove', touchMove);
//       canvas.removeEventListener('mousemove', mouseMove);
//     };
//     // eslint-disable-next-line
//   }, [cleared]);

//   const checkScratchCompletion = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas?.getContext('2d');
//     if (!canvas || !ctx || isScratched) return;

//     const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     let transparentPixels = 0;

//     for (let i = 3; i < pixels.data.length; i += 4) {
//       if (pixels.data[i] < 128) transparentPixels++;
//     }

//     const transparency = transparentPixels / (canvas.width * canvas.height);
//     if (transparency > 0.5) {
//       setIsScratched(true);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       confetti();
//     }
//   };

//   useEffect(() => {
//     if (isScratched) {
//       setTimeout(() => setCleared(true), 50);
//     }
//     // eslint-disable-next-line
//   }, [isScratched]);

//   return (
//     <div className="flex flex-col items-center">
//       <span className="mb-2 text-black text-lg font-bold">{text}</span>
//       <motion.div
//         ref={containerRef}
//         className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg"
//         style={{ width, height }}
//         initial={{ scale: 1 }}
//         animate={cleared ? { scale: 1.05 } : { scale: 1 }}
//         transition={{ type: 'spring', stiffness: 300 }}
//       >
//         <div className="absolute inset-0 z-0 flex items-center justify-center text-center px-4 text-black text-lg font-bold">
//           {revealText}
//         </div>
//         {!cleared && (
//           <canvas
//             ref={canvasRef}
//             className="absolute inset-0 z-10 touch-none rounded-2xl"
//           />
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default ScratchCard;

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  coverImage?: string;
  text?: string;
  revealText?: string;
  textColor?: string;
  brushSize?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  width = 300,
  height = 150,
  coverColor = '#C0C0C0',
  coverImage,
  text = 'Scratch Me!',
  revealText = 'You Won! 🎉',
  textColor = '#000000',
  brushSize = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Draw cover
    const drawCover = () => {
      if (coverImage && imageLoaded) {
        const img = new Image();
        img.src = coverImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          ctx.globalCompositeOperation = 'destination-out';
        };
      } else {
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-out';
      }
    };

    drawCover();
  }, [width, height, coverColor, coverImage, imageLoaded]);

  // Load image if provided
  useEffect(() => {
    if (coverImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = coverImage;
    } else {
      setImageLoaded(true);
    }
  }, [coverImage]);

  // Event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getPosition = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left,
        y: ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
      };
    };

    const startScratching = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      setIsDrawing(true);
      const pos = getPosition(e);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      checkScratchCompletion();
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getPosition(e);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize, 0, Math.PI * 2);
      ctx.fill();
      checkScratchCompletion();
    };

    const stopScratching = () => {
      setIsDrawing(false);
    };

    // Mouse events
    canvas.addEventListener('mousedown', startScratching);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', stopScratching);
    canvas.addEventListener('mouseleave', stopScratching);

    // Touch events
    canvas.addEventListener('touchstart', startScratching);
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', stopScratching);

    return () => {
      // Clean up mouse events
      canvas.removeEventListener('mousedown', startScratching);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('mouseup', stopScratching);
      canvas.removeEventListener('mouseleave', stopScratching);

      // Clean up touch events
      canvas.removeEventListener('touchstart', startScratching);
      canvas.removeEventListener('touchmove', scratch);
      canvas.removeEventListener('touchend', stopScratching);
    };
  }, [isDrawing, brushSize]);

  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || isScratched) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparentPixels++;
    }

    const transparency = transparentPixels / (canvas.width * canvas.height);
    setTextOpacity(1 - Math.min(transparency * 1.5, 1));

    if (transparency > 0.5) {
      setIsScratched(true);
      confetti();
      setTimeout(() => setCleared(true), 30
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        ref={containerRef}
        className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-lg"
        style={{ width, height }}
        initial={{ scale: 1 }}
        animate={cleared ? { scale: 1.05 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Revealed content */}
        <div className="absolute inset-0 z-0 flex items-center justify-center text-center px-4 text-black text-lg font-bold bg-white">
          {revealText}
        </div>

        {/* Scratchable area */}
        {!cleared && (
          <div className="absolute inset-0 z-10">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 z-20 touch-none rounded-2xl"
            />
            {/* Scratch me text */}
            <div
              className="absolute inset-0 z-30 flex items-center justify-center text-center px-4 text-lg font-bold pointer-events-none"
              style={{
                color: textColor,
                opacity: textOpacity,
                transition: 'opacity 0.2s ease',
              }}
            >
              {text}


            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};


export default ScratchCard;








