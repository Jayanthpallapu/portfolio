'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, BarChart3, Database, GitBranch } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const highlights = [
  {
    icon: <Brain size={28} />,
    value: '3+',
    label: 'Years in Data Science',
    color: '#3b82f6',
  },
  {
    icon: <BarChart3 size={28} />,
    value: '4',
    label: 'Companies Worked',
    color: '#38bdf8',
  },
  {
    icon: <Database size={28} />,
    value: 'End-to-End',
    label: 'Analytics Pipelines',
    color: '#818cf8',
  },
  {
    icon: <GitBranch size={28} />,
    value: 'A/B Testing',
    label: 'Experimentation Expert',
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
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          About <span className="text-[#38bdf8] glow-text-blue">Me</span>
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
            I&apos;m Jayanth Pallapu, a Data Scientist with strong experience applying
            statistical analysis and machine learning to solve complex product and
            business problems. I have a proven track record of building end-to-end
            analytics pipelines, developing predictive models, running experiments
            (A/B testing), and translating insights into measurable product improvements.
          </p>
          <p className="text-gray-400 leading-relaxed">
            I&apos;m experienced in collaborating with Product Managers, Engineers, and UX
            teams to define success metrics, influence product direction, and drive
            data-informed decisions at scale. My expertise spans from exploratory data
            analysis and feature engineering to model deployment and performance monitoring
            in production environments.
          </p>
          <p className="text-gray-400 leading-relaxed">
            With a solid foundation in Python, statistical inference, and machine learning,
            I thrive on uncovering hidden patterns in data and turning them into actionable
            strategies that create real business impact. I hold a B.Com in Computer
            Applications from Sri Venkateswara University, Tirupathi.
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
