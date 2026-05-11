'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const experiences = [
  {
    company: 'TechVista Solutions',
    role: 'Senior Software Engineer',
    duration: '2022 — Present',
    description:
      'Leading the development of microservices architecture serving 100K+ daily active users. Spearheading migration from monolithic to distributed systems, reducing response times by 60%.',
    achievements: [
      'Architected event-driven microservices handling 1M+ daily requests',
      'Reduced deployment time by 75% through CI/CD pipeline optimization',
      'Mentored team of 5 junior developers on best practices',
      'Implemented real-time monitoring with custom alerting systems',
    ],
    tech: ['Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Redis'],
    color: '#00d4ff',
  },
  {
    company: 'InnovateTech Inc.',
    role: 'Full Stack Developer',
    duration: '2020 — 2022',
    description:
      'Built real-time collaboration features and RESTful APIs for enterprise SaaS platform. Delivered high-impact features that increased user engagement by 40%.',
    achievements: [
      'Developed WebSocket-based real-time collaboration engine',
      'Built RESTful API serving 500K+ requests per day',
      'Implemented OAuth2 and role-based access control system',
      'Optimized database queries reducing load time by 45%',
    ],
    tech: ['React', 'Python', 'Django', 'PostgreSQL', 'WebSocket', 'Redis'],
    color: '#8b5cf6',
  },
  {
    company: 'CodeCraft Labs',
    role: 'Junior Developer',
    duration: '2018 — 2020',
    description:
      'Developed responsive web applications and implemented automated testing frameworks. Contributed to open-source projects and internal tooling.',
    achievements: [
      'Built 10+ responsive web applications from scratch',
      'Implemented automated testing achieving 90% code coverage',
      'Created internal CLI tools improving developer productivity',
      'Contributed to 3 open-source libraries with 500+ GitHub stars',
    ],
    tech: ['JavaScript', 'Vue.js', 'Express', 'MongoDB', 'Jest', 'Git'],
    color: '#3b82f6',
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
          className="text-[#00d4ff] text-sm font-mono tracking-wider uppercase mb-3"
        >
          My professional journey
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Work <span className="text-[#00d4ff] glow-text-blue">Experience</span>
        </h2>
      </div>

      <div ref={timelineRef} className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00d4ff]/50 via-[#8b5cf6]/50 to-[#3b82f6]/50 md:-translate-x-px" />

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
    </SectionWrapper>
  );
}
