'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import SectionWrapper from './SectionWrapper';

const projects = [
  {
    name: 'Nvidia DriveSync',
    description:
      'Architected a multi-modal data curation and hybrid vector retrieval pipeline in Python for NVIDIA technical documentation using Qdrant, PyMuPDF, and Scrapy. Implemented dense and BM25 sparse vector search with Reciprocal Rank Fusion (RRF) deduplication to enable low-latency, context-rich retrieval for LLM agent workflows.',
    tech: ['Python', 'Qdrant', 'PyMuPDF', 'Scrapy', 'RRF Search', 'BM25 Sparse'],
    color: '#3b82f6',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      'Multi-modal data curation & hybrid vector retrieval pipeline',
      'Dense and BM25 sparse vector search with RRF deduplication',
      'Low-latency, context-rich retrieval for LLM agent workflows',
    ],
  },
  {
    name: 'XAU/BTC Realtime Analysis',
    description:
      'Built an enterprise-grade multi-agent AI platform utilizing CrewAI, Groq (Llama 3.3), FastAPI, and Next.js to automate gold market correlation research, news sentiment mining, and paper trading execution across 6 specialized autonomous agents. Integrated Model Context Protocol (MCP) with 25 tools, real-time WebSocket telemetry, Supabase database persistence, and self-healing supervisor auditing with live Telegram alerts.',
    tech: ['CrewAI', 'Groq (Llama 3.3)', 'FastAPI', 'Next.js', 'MCP', 'Supabase', 'WebSockets'],
    color: '#38bdf8',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      '6 specialized autonomous agents for market research & paper trading',
      'Integrated Model Context Protocol (MCP) with 25 tools',
      'Real-time WebSocket telemetry, Supabase persistence & live Telegram alerts',
    ],
  },
  {
    name: 'Customer-churn-prediction-ML-pipeline',
    description:
      'Engineered an end-to-end Customer Churn Prediction system in Python using EDA, cohort analysis, and feature engineering to identify key attrition drivers. Built an automated MLOps pipeline with Apache Airflow for ETL, data validation, model retraining, and real-time risk scoring, along with a Streamlit dashboard for retention insights.',
    tech: ['Python', 'EDA', 'Cohort Analysis', 'Apache Airflow', 'MLOps', 'Streamlit'],
    color: '#818cf8',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      'EDA & cohort analysis for identifying key attrition drivers',
      'Automated MLOps pipeline with Apache Airflow for ETL & retraining',
      'Real-time risk scoring & Streamlit retention dashboard',
    ],
  },
  {
    name: 'House Price prediction model',
    description:
      'Developed an end-to-end predictive modeling pipeline in Python for residential property valuation, performing EDA, feature engineering, outlier handling, imputation, encoding, and feature scaling to prepare high-quality data for accurate model training and prediction.',
    tech: ['Python', 'EDA', 'Feature Engineering', 'Outlier Handling', 'Imputation', 'Feature Scaling'],
    color: '#06b6d4',
    github: 'https://github.com/Jayanthpallapu',
    live: '#',
    highlights: [
      'End-to-end predictive modeling pipeline for property valuation',
      'EDA, outlier handling, strategic imputation & One-Hot encoding',
      'Rigorous feature scaling to prepare high-quality data for model training',
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
          className="text-[#38bdf8] text-base font-mono tracking-wider uppercase mb-3"
        >
          What I&apos;ve built
        </motion.p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          Featured <span className="text-[#38bdf8] glow-text-blue">Projects</span>
        </h2>
      </div>

      <div ref={gridRef} className="grid md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="glass rounded-2xl p-8 group cursor-pointer transition-all duration-300 flex flex-col"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 30px color-mix(in srgb, ${project.color} 12.5%, transparent)`;
              e.currentTarget.style.borderColor = `color-mix(in srgb, ${project.color} 18.8%, transparent)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            {/* Project color accent bar */}
            <div
              className="w-16 h-1.5 rounded-full mb-5 transition-all duration-300 group-hover:w-24"
              style={{ backgroundColor: project.color }}
            />

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5 font-normal">
              {project.description}
            </p>

            {/* Highlights */}
            <ul className="space-y-2 mb-6">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm md:text-base text-gray-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: project.color }} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2.5 mb-6 mt-auto">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 text-xs md:text-sm rounded-lg font-medium"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${project.color} 6.3%, transparent)`,
                    color: project.color,
                    border: `1px solid color-mix(in srgb, ${project.color} 12.5%, transparent)`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base text-gray-300 hover:text-white font-medium transition-colors"
              >
                <Github size={18} />
                <span>Code</span>
              </a>
              <a
                href={project.live}
                target={project.live.startsWith('http') ? '_blank' : undefined}
                rel={project.live.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 text-base text-gray-300 hover:text-white font-medium transition-colors"
                onClick={(e) => { if (project.live === '#') e.preventDefault(); }}
              >
                <ExternalLink size={18} />
                <span>Live Demo</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
