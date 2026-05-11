'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import SectionBackground, { type BackgroundVariant } from './SectionBackground';

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
  backgroundVariant?: BackgroundVariant;
  showDivider?: boolean;
}

export default function SectionWrapper({ children, id, className = '', backgroundVariant, showDivider = true }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}
    >
      {/* Animated background */}
      {backgroundVariant && (
        <SectionBackground variant={backgroundVariant} />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-6xl mx-auto"
      >
        {children}
      </motion.div>

      {/* Section glow divider */}
      {showDivider && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      )}
    </section>
  );
}
