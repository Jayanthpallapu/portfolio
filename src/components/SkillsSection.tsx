'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import SectionWrapper from './SectionWrapper';

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Python & ML',
    color: '#3b82f6',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Pandas & NumPy', level: 93 },
      { name: 'Scikit-learn', level: 90 },
      { name: 'Exploratory Data Analysis', level: 92 },
      { name: 'Supervised Learning', level: 88 },
    ],
  },
  {
    title: 'Statistics',
    color: '#818cf8',
    skills: [
      { name: 'Inferential Statistics', level: 90 },
      { name: 'Hypothesis Testing', level: 88 },
      { name: 'A/B Experimental Design', level: 85 },
      { name: 'Regression Analysis', level: 87 },
      { name: 'Probability Theory', level: 85 },
    ],
  },
  {
    title: 'Data & Databases',
    color: '#06b6d4',
    skills: [
      { name: 'SQL', level: 92 },
      { name: 'Data Wrangling', level: 90 },
      { name: 'Database Management', level: 85 },
      { name: 'Data Warehousing', level: 80 },
      { name: 'ETL Pipelines', level: 82 },
    ],
  },
  {
    title: 'Tools & MLOps',
    color: '#38bdf8',
    skills: [
      { name: 'Git & Version Control', level: 88 },
      { name: 'Apache Airflow', level: 78 },
      { name: 'Streamlit', level: 82 },
      { name: 'Data Visualization', level: 85 },
      { name: 'MLOps & Model Monitoring', level: 80 },
    ],
  },
];

function SkillBar({ skill, color, delay }: { skill: Skill; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium">{skill.name}</span>
        <span className="text-xs text-gray-500 font-mono">{skill.level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: delay, duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 50%, transparent))`,
            boxShadow: `0 0 10px color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-2 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('Python & ML');
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-50px' });

  const activeSkills = skillCategories.find((c) => c.title === activeCategory);

  return (
    <SectionWrapper id="skills" backgroundVariant="neural">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#38bdf8] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Technologies I work with
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Skills & <span className="text-[#38bdf8] glow-text-blue">Expertise</span>
        </h2>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {skillCategories.map((category) => (
          <button
            key={category.title}
            onClick={() => setActiveCategory(category.title)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === category.title
                ? 'text-white'
                : 'text-gray-400 bg-white/5 hover:bg-white/10 hover:text-gray-200 border border-white/5'
            }`}
            style={
              activeCategory === category.title
                ? {
                    backgroundColor: `color-mix(in srgb, ${category.color} 12.5%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${category.color} 25%, transparent)`,
                    color: category.color,
                    boxShadow: `0 0 15px color-mix(in srgb, ${category.color} 8.2%, transparent)`,
                  }
                : {}
            }
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Skills Display */}
      <div ref={gridRef} className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {activeSkills?.skills.map((skill, i) => (
            <SkillBar
              key={`${activeCategory}-${skill.name}`}
              skill={skill}
              color={activeSkills.color}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Additional Skills Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">Also experienced with</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Predictive Modeling', 'Feature Engineering', 'Cohort Analysis',
              'Root Cause Analysis', 'Data Cleaning', 'One-Hot Encoding',
              'Model Evaluation', 'Business KPIs', 'Fraud Detection',
              'Anomaly Detection', 'Stakeholder Reporting', 'Cross-functional Collaboration',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs rounded-lg text-gray-400 bg-white/5 border border-white/5 hover:border-[#38bdf8]/30 hover:text-[#38bdf8] transition-colors duration-200 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
