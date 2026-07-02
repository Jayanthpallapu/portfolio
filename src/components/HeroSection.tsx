'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown, Mail, MapPin } from 'lucide-react';
import { Spotlight } from './ui/spotlight';
import { SplineScene } from './ui/splite';
import { Lightning } from './ui/lightning';
import { ElasticHueSlider } from './ui/hue-slider';

export default function HeroSection() {
  const [lightningHue, setLightningHue] = useState(360); // Default red/pink hue as shown in user's image

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-hue', lightningHue.toString());
  }, [lightningHue]);

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* ==================== FULL-SCREEN INTERACTIVE BACKGROUND ==================== */}
      <div className="absolute inset-0 z-0 bg-black pointer-events-none select-none">
        
        {/* Ambient Spotlight */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20 z-5"
          fill={`hsl(${lightningHue}, 90%, 55%)`}
        />

        {/* Glowing Aura circle matching active Hue - aligned behind the robot */}
        <div 
          className="absolute top-[50%] lg:top-[50%] left-1/2 lg:left-[75%] transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[650px] lg:h-[650px] rounded-full blur-3xl opacity-50 transition-all duration-300 z-1"
          style={{
            background: `radial-gradient(circle, hsl(${lightningHue}, 85%, 50%) 0%, transparent 70%)`
          }}
        ></div>
        

        {/* Full-screen WebGL Lightning Shader (drawn on top of the planet but behind the robot) */}
        <div className="absolute inset-0 z-20 opacity-80 mix-blend-screen">
          <Lightning
            hue={lightningHue}
            speed={1.5}
            intensity={0.65}
            size={1.8}
          />
        </div>

      </div>

      {/* ==================== FOREGROUND CONTENT ==================== */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 pt-24 lg:pt-16 pb-12">
        
        {/* Left Column: Text & Slider */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          
          {/* Profile Image / Initials */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6 flex justify-center lg:justify-start w-full"
          >
            <div className="relative">
              <div 
                className="w-28 h-28 md:w-32 md:h-32 rounded-full p-[3px] transition-colors duration-300"
                style={{
                  background: `linear-gradient(135deg, hsl(${lightningHue}, 85%, 55%), hsl(${(lightningHue + 40) % 360}, 85%, 55%))`
                }}
              >
                <div className="w-full h-full rounded-full bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  <span 
                    className="text-3xl md:text-4xl font-bold transition-all duration-300"
                    style={{
                      color: `hsl(${lightningHue}, 85%, 55%)`,
                      textShadow: `0 0 15px hsl(${lightningHue}, 85%, 55%, 0.5)`
                    }}
                  >
                    JP
                  </span>
                </div>
              </div>
              {/* Orbiting dot */}
              <motion.div
                className="absolute w-2.5 h-2.5 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                  translateX: '64px',
                  translateY: '-1.2px',
                  backgroundColor: `hsl(${lightningHue}, 85%, 55%)`,
                  boxShadow: `0 0 12px hsl(${lightningHue}, 85%, 55%, 0.8), 0 0 24px hsl(${lightningHue}, 85%, 55%, 0.4)`,
                }}
              />
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center lg:justify-start gap-2 text-blue-300/60 mb-3 w-full"
          >
            <MapPin size={14} />
            <span className="text-sm tracking-wide">Bangalore, India</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-center lg:text-left w-full"
          >
            <span className="text-white">JAYANTH</span>{' '}
            <span 
              className="text-transparent bg-clip-text transition-all duration-300"
              style={{
                backgroundImage: `linear-gradient(to right, hsl(${lightningHue}, 85%, 55%), hsl(${(lightningHue + 30) % 360}, 85%, 55%), hsl(${(lightningHue + 60) % 360}, 85%, 55%))`
              }}
            >
              PALLAPU
            </span>
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-4 w-full"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl text-blue-100/70 font-medium">
              Data Scientist
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-blue-200/40 text-base md:text-lg max-w-xl mb-6 leading-relaxed text-center lg:text-left"
          >
            Applying statistical analysis and machine learning to solve complex
            product and business problems. Translating insights into measurable
            product improvements at scale.
          </motion.p>

          {/* Interactive Lightning Hue Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-8 w-full flex justify-center lg:justify-start"
          >
            <ElasticHueSlider
              value={lightningHue}
              onChange={setLightningHue}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative w-full sm:w-auto px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, hsl(${lightningHue}, 75%, 45%), hsl(${lightningHue}, 85%, 55%))`,
                boxShadow: `0 0 20px hsl(${lightningHue}, 85%, 55%, 0.3)`
              }}
            >
              <Mail size={18} />
              Contact Me
            </a>
            <a
              href="#"
              className="group relative w-full sm:w-auto px-8 py-3.5 border border-blue-400/30 text-blue-300 font-semibold rounded-xl hover:bg-blue-500/10 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
          </motion.div>
        </div>

        {/* Right Column: Transparent 3D Robot standing in front of background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.0, ease: 'easeOut' }}
          className="flex-1 w-full h-[350px] sm:h-[450px] lg:h-[550px] relative flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full bg-transparent"
            />
          </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 cursor-pointer"
          onClick={() => {
            document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] text-blue-400/40 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} className="text-blue-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
