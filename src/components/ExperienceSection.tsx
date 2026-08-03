'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const experiences = [
  {
    company: 'Quite Labs',
    role: 'Data Science Manager',
    duration: '11/2025 | Vishakapatanam',
    description:
      'Led AI strategy and deployment for clients by building multi-agent systems using CrewAI, LangChain, and LangGraph to automate workflows and improve efficiency.',
    achievements: [
      'Led AI strategy and deployment for clients by building multi-agent systems using CrewAI, LangChain, and LangGraph to automate workflows and improve efficiency',
      'Developed an AI Researcher Agent that expanded a co-CEO team’s active funder pipeline from 1 to 20+ opportunities',
      'Managed client engagement, solution architecture, and cross-functional collaboration',
    ],
    tech: ['CrewAI', 'LangChain', 'LangGraph', 'Multi-Agent AI', 'AI Strategy', 'Solution Architecture'],
    color: '#3b82f6',
  },
  {
    company: 'Matrimony.com',
    role: 'Team Leader',
    duration: '05/2025 – 11/2025 | Chennai, India',
    description:
      'Supported classification and regression initiatives by preparing analytical datasets, performing feature engineering, and validating data for predictive modeling.',
    achievements: [
      'Supported classification and regression initiatives by preparing analytical datasets, performing feature engineering, and validating data for predictive modeling',
      'Analyzed system and operational performance metrics to identify optimization opportunities',
      'Provided insights that supported model evaluation and business KPI improvements',
    ],
    tech: ['Python', 'Classification', 'Regression', 'Feature Engineering', 'KPI Metrics'],
    color: '#38bdf8',
  },
  {
    company: 'Gusto software solutions Pvt, Ltd',
    role: 'Team Lead',
    duration: '05/2024 – 05/2025 | Hyderabad, India',
    description:
      'Evaluated process improvements through pre- and post implementation metric analysis, supporting experimentation and continuous optimization initiatives.',
    achievements: [
      'Evaluated process improvements through pre- and post implementation metric analysis, supporting experimentation and continuous optimization initiatives',
      'Monitored ML model performance in production by analyzing accuracy, error patterns, and real-world outcomes',
      'Collaborated with product teams to identify opportunities for model enhancement and high-impact use cases',
    ],
    tech: ['ML Performance', 'Production Monitoring', 'Metric Analysis', 'Experimentation', 'Model Enhancement'],
    color: '#818cf8',
  },
  {
    company: 'Concentrix Technologies Pvt Ltd.',
    role: 'Technical Support Specialist',
    duration: '05/2023 – 04/2024 | Bangalore, India',
    description:
      'Prepared and standardized infrastructure and support datasets for analytical modeling by cleaning and validating incident data.',
    achievements: [
      'Prepared and standardized infrastructure and support datasets for analytical modeling by cleaning and validating incident data',
      'Analyzed large-scale support data to identify recurring issues, trends, and frequency patterns',
      'Provided data-driven recommendations to enhance customer experience and improve system reliability',
    ],
    tech: ['Data Cleaning', 'Infrastructure Analytics', 'Incident Data Validation', 'Pattern Analysis'],
    color: '#06b6d4',
  },
  {
    company: 'IEnergizer Pvt Ltd',
    role: 'Customer Service Representative',
    duration: '06/2022 – 04/2023 | Bangalore, India',
    description:
      'Analyzed customer order datasets to identify fraud patterns and anomalies, helping reduce false positives through data-driven insights.',
    achievements: [
      'Analyzed customer order datasets to identify fraud patterns and anomalies, helping reduce false positives through data-driven insights',
      'Created Root Cause Analysis (RCA) reports using statistical analysis, performance metrics, and data visualizations to support operational decision-making',
      'Collaborated with clients and cross-functional teams to convert analytical findings into actionable business improvements',
    ],
    tech: ['Fraud Detection', 'Root Cause Analysis (RCA)', 'Statistical Analysis', 'Data Visualization', 'Anomaly Detection'],
    color: '#60a5fa',
  },
];

const educationList = [
  {
    degree: 'B.com Computer Applications',
    institution: 'Sri Venkateswara University, Tirupathi',
    date: '09/2022',
  },
  {
    degree: 'Common Proficiency Test ( CPT )',
    institution: 'Institute of Chartered accountants of India',
    date: '06/2016 | Chennai',
  },
];

export default function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, margin: '-100px' });

  return (
    <SectionWrapper id="experience" backgroundVariant="data-stream">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          My professional journey
        </motion.p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Work <span className="text-[#38bdf8] glow-text-blue">Experience</span>
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 md:-translate-x-px" />

        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <motion.div
              key={`${exp.company}-${exp.role}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.7, ease: 'easeOut' }}
              className={`relative flex flex-col md:flex-row items-start gap-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 top-6 w-3 h-3 rounded-full -translate-x-1/2 md:-translate-x-1.5 z-10"
                style={{
                  backgroundColor: exp.color,
                  boxShadow: `0 0 12px color-mix(in srgb, ${exp.color} 37.6%, transparent)`,
                }}
              />

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />

              {/* Card */}
              <div className="ml-12 md:ml-0 md:w-1/2">
                <motion.div
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-6 md:p-7 transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 30px color-mix(in srgb, ${exp.color} 8.2%, transparent)`;
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${exp.color} 18.8%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `color-mix(in srgb, ${exp.color} 8.2%, transparent)`, color: exp.color }}
                    >
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg md:text-xl">{exp.role}</h3>
                      <p style={{ color: exp.color }} className="text-sm md:text-base font-semibold">
                        {exp.company}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs md:text-sm mb-2 font-mono">{exp.duration}</p>
                  <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">{exp.description}</p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-4">
                    {exp.achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2 text-sm md:text-base text-gray-400">
                        <ChevronRight size={16} className="mt-0.5 flex-shrink-0" style={{ color: exp.color }} />
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
                          backgroundColor: `color-mix(in srgb, ${exp.color} 6.3%, transparent)`,
                          color: exp.color,
                          border: `1px solid color-mix(in srgb, ${exp.color} 12.5%, transparent)`,
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
      <div className="mt-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            Education & <span className="text-[#38bdf8]">Qualifications</span>
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {educationList.map((edu) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-6 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg md:text-xl">{edu.degree}</h4>
                  <p className="text-primary text-sm md:text-base font-medium mt-1">{edu.institution}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-mono self-end">{edu.date}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
