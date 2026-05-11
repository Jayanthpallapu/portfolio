'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: <Github size={18} />, href: 'https://github.com/jayanthpallapu', label: 'GitHub' },
  { icon: <Linkedin size={18} />, href: 'https://linkedin.com/in/jayanthpallapu', label: 'LinkedIn' },
  { icon: <Mail size={18} />, href: 'mailto:jayanth.pallapu@email.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#00d4ff]/10">
      {/* Glow line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>&copy; {new Date().getFullYear()} Jayanth Pallapu. Built with</span>
            <Heart size={14} className="text-[#00d4ff] fill-[#00d4ff]" />
            <span>and lots of coffee.</span>
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
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#00d4ff] transition-colors"
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
