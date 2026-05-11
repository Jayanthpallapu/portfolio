'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export default function SectionWrapper({ children, id, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
}
