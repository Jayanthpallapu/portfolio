'use client';

import { motion } from 'framer-motion';
import { Download, ChevronDown, Mail, MapPin } from 'lucide-react';
import ParticleBackground from './ParticleBackground';

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-transparent to-[#0a0a1a] z-[1]" />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d4ff]/5 rounded-full blur-[120px] z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full gradient-border p-[3px]">
              <div className="w-full h-full rounded-full bg-[#0f0f2a] flex items-center justify-center overflow-hidden">
                <span className="text-4xl md:text-5xl font-bold text-[#00d4ff] glow-text-blue">
                  JP
                </span>
              </div>
            </div>
            {/* Orbiting dot */}
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-[#00d4ff] glow-blue-sm"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                translateX: '80px md:96px',
                translateY: '-1.5px',
              }}
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-gray-400 mb-4"
        >
          <MapPin size={14} />
          <span className="text-sm">Based in India</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4"
        >
          <span className="text-white">JAYANTH</span>{' '}
          <span className="text-[#00d4ff] glow-text-blue">PALLAPU</span>
        </motion.h1>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium">
            Full Stack Developer & Software Engineer
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Crafting digital experiences with clean code and innovative solutions.
          Passionate about turning complex problems into elegant, scalable applications.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative px-8 py-3.5 bg-[#00d4ff] text-[#0a0a1a] font-semibold rounded-xl hover:bg-[#00e5ff] transition-all duration-300 glow-blue hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] flex items-center gap-2"
          >
            <Mail size={18} />
            Contact Me
          </a>
          <a
            href="#"
            className="group relative px-8 py-3.5 border border-[#00d4ff]/30 text-[#00d4ff] font-semibold rounded-xl hover:bg-[#00d4ff]/10 transition-all duration-300 flex items-center gap-2"
          >
            <Download size={18} />
            Download Resume
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => {
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} className="text-[#00d4ff]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
