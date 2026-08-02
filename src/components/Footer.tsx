'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: <Github size={18} />, href: 'https://github.com/Jayanthpallapu', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/jayanth-pallapu', label: 'LinkedIn' },
  { icon: <Mail size={18} />, href: 'mailto:jayanth.pallapu@outlook.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/10 overflow-hidden">
      {/* Black background */}
      <div className="absolute inset-0 bg-black" />

      {/* Glow line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Subtle aurora remnant at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, color-mix(in srgb, var(--accent) 15%, transparent) 0%, color-mix(in srgb, var(--primary) 5%, transparent) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} Jayanth Pallapu. Built with</span>
            <Heart size={14} className="text-[#3b82f6] fill-[#3b82f6]" />
            <span>and Python.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#3b82f6] transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
