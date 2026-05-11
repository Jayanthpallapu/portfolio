'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const projects = [
  {
    name: 'CloudSync Dashboard',
    description:
      'Real-time cloud infrastructure monitoring platform with intelligent alerting, resource optimization, and cost analytics. Features live metrics visualization and automated incident response.',
    tech: ['React', 'TypeScript', 'Node.js', 'AWS', 'WebSocket', 'D3.js'],
    color: '#00d4ff',
    github: '#',
    live: '#',
  },
  {
    name: 'EcoTrack',
    description:
      'Sustainability tracking application that helps organizations measure, report, and reduce their carbon footprint. Integrates with IoT sensors for real-time environmental data collection.',
    tech: ['Next.js', 'Python', 'PostgreSQL', 'Docker', 'GraphQL', 'Tailwind'],
    color: '#10b981',
    github: '#',
    live: '#',
  },
  {
    name: 'DevFlow',
    description:
      'Developer workflow automation tool that streamlines CI/CD pipelines, code reviews, and deployment processes. Features AI-powered code suggestions and automated testing orchestration.',
    tech: ['TypeScript', 'Go', 'Redis', 'Kubernetes', 'gRPC', 'React'],
    color: '#8b5cf6',
    github: '#',
    live: '#',
  },
  {
    name: 'MediConnect',
    description:
      'Healthcare telemedicine platform enabling secure video consultations, appointment scheduling, and electronic health records management with HIPAA-compliant architecture.',
    tech: ['React', 'Node.js', 'WebRTC', 'MongoDB', 'AWS', 'Socket.io'],
    color: '#f43f5e',
    github: '#',
    live: '#',
  },
  {
    name: 'FinanceHub',
    description:
      'Personal finance management system with AI-driven budget insights, expense tracking, investment portfolio analytics, and automated savings recommendations.',
    tech: ['Next.js', 'Python', 'PostgreSQL', 'Plaid API', 'Redis', 'Chart.js'],
    color: '#f59e0b',
    github: '#',
    live: '#',
  },
  {
    name: 'SmartLearn AI',
    description:
      'AI-powered learning management system with adaptive curriculum, intelligent tutoring, progress analytics, and personalized content recommendations using machine learning.',
    tech: ['Vue.js', 'Django', 'TensorFlow', 'PostgreSQL', 'Docker', 'AWS'],
    color: '#06b6d4',
    github: '#',
    live: '#',
  },
];

export default function ProjectsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-50px' });

  return (
    <SectionWrapper id="projects">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#00d4ff] text-sm font-mono tracking-wider uppercase mb-3"
        >
          What I&apos;ve built
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Featured <span className="text-[#00d4ff] glow-text-blue">Projects</span>
        </h2>
      </div>

      <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass rounded-2xl p-6 group cursor-pointer transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 30px ${project.color}20`;
              e.currentTarget.style.borderColor = `${project.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            {/* Project color accent bar */}
            <div
              className="w-12 h-1 rounded-full mb-4 transition-all duration-300 group-hover:w-20"
              style={{ backgroundColor: project.color }}
            />

            <h3 className="text-xl font-bold text-white mb-2 group-hover:transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 text-xs rounded-md font-medium"
                  style={{
                    backgroundColor: `${project.color}10`,
                    color: project.color,
                    border: `1px solid ${project.color}20`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
              <a
                href={project.github}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Github size={16} />
                <span>Code</span>
              </a>
              <a
                href={project.live}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ExternalLink size={16} />
                <span>Live Demo</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
