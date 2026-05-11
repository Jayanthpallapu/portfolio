'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const experiences = [
  {
    company: 'Matrimony.com',
    role: 'Team Leader — Data Science',
    duration: 'May 2025 — Nov 2025 | Chennai, India',
    description:
      'Supported classification and regression use cases by preparing high-quality analytical datasets, performing feature engineering, and validating data inputs for predictive modeling and inference.',
    achievements: [
      'Prepared high-quality analytical datasets with rigorous feature engineering for predictive modeling',
      'Analyzed system and operational performance metrics to identify optimization opportunities',
      'Contributed insights that informed model evaluation criteria and business KPIs',
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'A/B Testing'],
    color: '#3b82f6',
  },
  {
    company: 'Gusto Software Solutions Pvt, Ltd',
    role: 'Team Lead — Data Science',
    duration: 'May 2024 — May 2025 | Hyderabad, India',
    description:
      'Evaluated the impact of process changes by comparing pre- and post-implementation metrics, effectively supporting experimentation and continuous optimization initiatives.',
    achievements: [
      'Managed and monitored ML model performance in production environments',
      'Worked closely with product teams to evaluate statistical accuracy and error patterns',
      'Identified high-impact use cases for continuous model improvement and optimization',
    ],
    tech: ['Python', 'Machine Learning', 'SQL', 'Statistical Analysis', 'MLOps'],
    color: '#818cf8',
  },
  {
    company: 'Concentrix Technologies Pvt Ltd',
    role: 'Technical Support Specialist',
    duration: 'May 2023 — Apr 2024 | Bangalore, India',
    description:
      'Prepared and validated infrastructure and support datasets for downstream analytical modeling by cleaning, structuring, and standardizing incident data.',
    achievements: [
      'Analyzed large-scale support datasets to identify recurring issue patterns and trend deviations',
      'Enabled data-backed recommendations to improve customer experience and system reliability',
      'Identified frequency distributions and statistical anomalies in support data',
    ],
    tech: ['Python', 'SQL', 'Data Analysis', 'Statistical Summaries', 'Visualization'],
    color: '#06b6d4',
  },
  {
    company: 'IEnergizer Pvt Ltd',
    role: 'Customer Service Representative',
    duration: 'Jun 2022 — Apr 2023 | Bangalore, India',
    description:
      'Conducted analytical evaluation of customer order datasets to identify fraud patterns and anomalies, supporting reduction of false positives through quantitative analysis.',
    achievements: [
      'Developed and delivered Root Cause Analysis (RCA) reports using statistical summaries and data visualization',
      'Identified fraud patterns and anomalies, reducing false positives through quantitative analysis',
      'Collaborated with clients and internal teams to translate analytical findings into actionable insights',
    ],
    tech: ['Python', 'Data Visualization', 'RCA', 'Quantitative Analysis', 'Reporting'],
    color: '#38bdf8',
  },
];

export default function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: '-100px' });

  return (
    <SectionWrapper id="experience">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          My professional journey
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Work <span className="text-[#38bdf8] glow-text-blue">Experience</span>
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#3b82f6]/50 via-[#818cf8]/50 to-[#38bdf8]/50 md:-translate-x-px" />

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.3, duration: 0.7, ease: 'easeOut' }}
              className={`relative flex flex-col md:flex-row items-start gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full -translate-x-1/2 md:-translate-x-1.5 z-10"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 12px ${exp.color}60`,
                }}
              />

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card */}
              <div className="ml-12 md:ml-0 md:w-1/2">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-6 transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px ${exp.color}15`;
                    e.currentTarget.style.borderColor = `${exp.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${exp.color}15`, color: exp.color }}
                    >
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{exp.role}</h3>
                      <p style={{ color: exp.color }} className="text-sm font-medium">
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-1 font-mono">{exp.duration}</p>
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{exp.description}</p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2 text-sm text-gray-400">
                        <ChevronRight size={14} className="mt-0.5 flex-shrink-0" style={{ color: exp.color }} />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-xs rounded-lg font-medium"
                        style={{
                          backgroundColor: `${exp.color}10`,
                          color: exp.color,
                          border: `1px solid ${exp.color}20`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="mt-16 glass rounded-2xl p-6 max-w-2xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#3b82f6]/10 text-[#3b82f6]">
            <Briefcase size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">B.Com Computer Applications</h3>
            <p className="text-[#38bdf8] text-sm font-medium">Sri Venkateswara University, Tirupathi</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm font-mono ml-13">Graduated: Sep 2022</p>
      </motion.div>
    </SectionWrapper>
  );
}
