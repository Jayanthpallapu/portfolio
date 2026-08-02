'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BeamsBackground } from './ui/beams-background';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress counter from 0 to 100
    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds total load transition

    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    const animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden select-none"
    >
      <BeamsBackground intensity="strong" className="flex items-center justify-center">
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-lg mx-auto">
          
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-8 relative"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#3b82f6] via-[#38bdf8] to-[#818cf8] shadow-[0_0_30px_rgba(56,189,248,0.4)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black/90 backdrop-blur-md flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#818cf8]">
                  JP
                </span>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2"
          >
            JAYANTH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#818cf8]">PALLAPU</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs sm:text-sm text-blue-200/60 tracking-widest uppercase mb-10 font-mono"
          >
            Applied AI Engineer & Data Science Manager
          </motion.p>

          {/* 0% - 100% Progress Bar Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-xs space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="tracking-wider uppercase text-gray-500">Initializing System</span>
              <span className="text-[#38bdf8] font-bold text-sm">{progress}%</span>
            </div>

            {/* Track */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative backdrop-blur-sm p-[1px] border border-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] via-[#38bdf8] to-[#818cf8] relative shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </BeamsBackground>
    </motion.div>
  );
}
