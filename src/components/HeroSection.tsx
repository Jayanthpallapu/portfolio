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
      {/* Liquid Blue Flow Background */}
      <ParticleBackground />

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

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
              <div className="w-full h-full rounded-full bg-[#020617]/80 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <span className="text-4xl md:text-5xl font-bold text-[#38bdf8] glow-text-blue">
                  JP
                </span>
              </div>
            </div>
            {/* Orbiting dot */}
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-[#38bdf8]"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '0 0',
                translateX: '80px',
                translateY: '-1.5px',
                boxShadow: '0 0 12px rgba(56, 189, 248, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)',
              }}
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-blue-300/60 mb-4"
        >
          <MapPin size={14} />
          <span className="text-sm tracking-wide">Based in India</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4"
        >
          <span className="text-white">JAYANTH</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] via-[#3b82f6] to-[#818cf8] gradient-flow-text">
            PALLAPU
          </span>
        </motion.h1>

        {/* Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl text-blue-100/70 font-medium">
            Full Stack Developer & Software Engineer
          </h2>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-blue-200/40 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
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
            className="group relative px-8 py-3.5 bg-gradient-to-r from-[#2563eb] to-[#3b82f6] text-white font-semibold rounded-xl hover:from-[#1d4ed8] hover:to-[#2563eb] transition-all duration-300 flex items-center gap-2"
            style={{ boxShadow: '0 0 20px rgba(37, 99, 235, 0.3), 0 0 40px rgba(37, 99, 235, 0.1)' }}
          >
            <Mail size={18} />
            Contact Me
          </a>
          <a
            href="#"
            className="group relative px-8 py-3.5 border border-blue-400/30 text-blue-300 font-semibold rounded-xl hover:bg-blue-500/10 hover:border-blue-400/50 transition-all duration-300 flex items-center gap-2"
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
          <span className="text-xs text-blue-400/40 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} className="text-blue-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
