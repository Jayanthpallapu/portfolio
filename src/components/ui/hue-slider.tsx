import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export const ElasticHueSlider: React.FC<ElasticHueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = 'Adjust Lightning Hue',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const progress = (value - min) / (max - min);
  const thumbPosition = progress * 100; // Percentage

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative w-full max-w-xs flex flex-col items-center select-none" ref={sliderRef}>
      {label && (
        <label htmlFor="hue-slider-native" className="text-gray-300 text-xs mb-1.5 font-medium tracking-wide">
          {label}
        </label>
      )}
      <div className="relative w-full h-5 flex items-center">
        {/* Native input: Handles interaction, but visually hidden */}
        <input
          id="hue-slider-native"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Custom Track */}
        <div className="absolute left-0 w-full h-1 bg-gray-800 rounded-full z-0"></div>

        {/* Custom Fill showing Hue Spectrum */}
        <div
          className="absolute left-0 h-1 rounded-full z-10 opacity-80"
          style={{
            width: `${thumbPosition}%`,
            background: `linear-gradient(to right, hsl(0, 80%, 50%), hsl(${value}, 80%, 50%))`,
          }}
        ></div>

        {/* Custom Thumb (Animated) */}
        <motion.div
          className="absolute z-30 w-4 h-4 bg-white rounded-full border-2 shadow-lg pointer-events-none"
          style={{
            left: `calc(${thumbPosition}% - 8px)`,
            borderColor: `hsl(${value}, 85%, 50%)`,
            boxShadow: `0 0 10px hsl(${value}, 85%, 60%)`,
          }}
          animate={{ scale: isDragging ? 1.35 : 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: isDragging ? 20 : 30 }}
        />
      </div>

      {/* Value Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="text-[10px] text-gray-500 font-mono mt-1"
        >
          {value}°
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
