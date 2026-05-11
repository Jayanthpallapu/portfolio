'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Rocket, Trophy, Users } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const highlights = [
  {
    icon: <Rocket size={28} />,
    value: '7+',
    label: 'Years Experience',
    color: '#00d4ff',
  },
  {
    icon: <Code2 size={28} />,
    value: '50+',
    label: 'Projects Completed',
    color: '#0ff',
  },
  {
    icon: <Users size={28} />,
    value: '100K+',
    label: 'Users Impacted',
    color: '#8b5cf6',
  },
  {
    icon: <Trophy size={28} />,
    value: '15+',
    label: 'Technologies Mastered',
    color: '#3b82f6',
  },
];

export default function AboutSection() {
  const highlightsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(highlightsRef, { once: true, margin: '-50px' });

  return (
    <SectionWrapper id="about">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#00d4ff] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Get to know me
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          About <span className="text-[#00d4ff] glow-text-blue">Me</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Bio Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          <p className="text-gray-300 leading-relaxed text-lg">
            I&apos;m Jayanth Pallapu, a passionate Full Stack Developer with expertise
            in building scalable web applications and creating seamless user
            experiences. With a strong foundation in both frontend and backend
            technologies, I bring ideas to life through clean code and innovative
            solutions.
          </p>
          <p className="text-gray-400 leading-relaxed">
            My journey in software development has been driven by a curiosity for
            how things work and a desire to build tools that make a difference.
            From architecting microservices that handle millions of requests to
            crafting pixel-perfect user interfaces, I thrive on tackling
            challenging problems across the full stack.
          </p>
          <p className="text-gray-400 leading-relaxed">
            When I&apos;m not coding, you&apos;ll find me exploring new technologies,
            contributing to open-source projects, and mentoring aspiring
            developers. I believe in continuous learning and pushing the
            boundaries of what&apos;s possible with technology.
          </p>
        </motion.div>

        {/* Highlights */}
        <div ref={highlightsRef} className="grid grid-cols-2 gap-4">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass rounded-2xl p-6 text-center group cursor-default"
              style={{
                boxShadow: `0 0 0 rgba(0,0,0,0)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${item.color}20`;
                e.currentTarget.style.borderColor = `${item.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-colors duration-300"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <h3
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: item.color }}
              >
                {item.value}
              </h3>
              <p className="text-gray-400 text-sm">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
