'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, BarChart3, Database, GitBranch } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const highlights = [
  {
    icon: <Brain size={28} />,
    value: '5',
    label: 'Companies / Roles',
    color: '#3b82f6',
  },
  {
    icon: <BarChart3 size={28} />,
    value: 'Multi-Agent',
    label: 'AI & Multi-Agent Systems',
    color: '#38bdf8',
  },
  {
    icon: <Database size={28} />,
    value: 'End-to-End',
    label: 'Analytics & ML Pipelines',
    color: '#818cf8',
  },
  {
    icon: <GitBranch size={28} />,
    value: 'Measurable ROI',
    label: 'Data Roadmaps & KPIs',
    color: '#06b6d4',
  },
];

export default function AboutSection() {
  const highlightsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(highlightsRef, { once: true, margin: '-50px' });

  return (
    <SectionWrapper id="about" backgroundVariant="constellation">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Get to know me
        </motion.p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          About <span className="text-[#38bdf8] glow-text-blue">Me</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Bio Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-5"
        >
          <p className="text-gray-200 leading-relaxed text-lg md:text-xl font-medium">
            Results-driven Applied AI Engineer specializing in architecting end-to-end
            AI solutions for complex business challenges.
          </p>
          <p className="text-gray-300 leading-relaxed text-base">
            Skilled in deploying analytics pipelines and predictive models with strong evaluation
            frameworks to maintain product performance. Collaborates with cross-functional
            teams to translate data into actionable product roadmaps and measurable ROI,
            effectively managing multiple high-priority initiatives in fast-paced environments.
          </p>
          <p className="text-gray-400 leading-relaxed text-base">
            Education background includes B.com Computer Applications from Sri Venkateswara University,
            Tirupathi (09/2022) and Common Proficiency Test (CPT) from Institute of Chartered Accountants of India (06/2016 | Chennai).
          </p>
        </motion.div>

        {/* Highlights */}
        <div ref={highlightsRef} className="grid grid-cols-2 gap-4 md:gap-5">
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
                e.currentTarget.style.boxShadow = `0 0 30px color-mix(in srgb, ${item.color} 12.5%, transparent)`;
                e.currentTarget.style.borderColor = `color-mix(in srgb, ${item.color} 25%, transparent)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-colors duration-300"
                style={{ backgroundColor: `color-mix(in srgb, ${item.color} 10%, transparent)`, color: item.color }}
              >
                {item.icon}
              </div>
              <h3
                className="text-2xl md:text-3xl font-extrabold mb-1"
                style={{ color: item.color }}
              >
                {item.value}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
