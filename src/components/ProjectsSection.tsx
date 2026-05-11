'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const projects = [
  {
    name: 'House Price Prediction Model',
    description:
      'Developed an end-to-end predictive modeling pipeline in Python to estimate residential property values, beginning with rigorous Exploratory Data Analysis (EDA) to handle skewness, identify outliers, and map feature correlations.',
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'EDA', 'Feature Engineering'],
    color: '#3b82f6',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      'Strategic imputation, One-Hot encoding, and feature scaling',
      'Rigorous EDA for skewness and outlier detection',
      'Feature correlation mapping and high-impact variable engineering',
    ],
  },
  {
    name: 'Customer Churn Prediction ML Pipeline',
    description:
      'Engineered an end-to-end Customer Churn Prediction system using Python, beginning with rigorous EDA utilizing cohort analysis and feature interaction maps to identify key drivers of attrition.',
    tech: ['Python', 'Apache Airflow', 'Streamlit', 'Scikit-learn', 'MLOps', 'SQL'],
    color: '#818cf8',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      'Automated MLOps pipeline with Apache Airflow',
      'Daily ETL orchestration, data validation, and model retraining',
      'Real-time risk scoring with Streamlit dashboard',
    ],
  },
  {
    name: 'Lumina Code Suite',
    description:
      'A web application showcasing data science projects and analytics solutions. Features interactive dashboards and data visualization tools for business intelligence and reporting.',
    tech: ['Python', 'Data Visualization', 'SQL', 'Statistics', 'Dashboard'],
    color: '#06b6d4',
    github: 'https://github.com/Jayanthpallapu',
    live: 'https://lumina-code-suite.lovable.app',
    highlights: [
      'Interactive analytics dashboards',
      'Business intelligence reporting',
      'Data visualization for stakeholder insights',
    ],
  },
];

export default function ProjectsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-50px' });

  return (
    <SectionWrapper id="projects" backgroundVariant="circuit">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          What I&apos;ve built
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Featured <span className="text-[#38bdf8] glow-text-blue">Projects</span>
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
            className="glass rounded-2xl p-6 group cursor-pointer transition-all duration-300 flex flex-col"
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

            {/* Highlights */}
            <ul className="space-y-1.5 mb-4">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs text-gray-500">
                  <span className="mt-1 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-5 mt-auto">
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
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Github size={16} />
                <span>Code</span>
              </a>
              <a
                href={project.live}
                target={project.live.startsWith('http') ? '_blank' : undefined}
                rel={project.live.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                onClick={(e) => { if (project.live === '#') e.preventDefault(); }}
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
