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
    title: 'Frontend',
    color: '#00d4ff',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 92 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 93 },
      { name: 'Vue.js', level: 78 },
    ],
  },
  {
    title: 'Backend',
    color: '#8b5cf6',
    skills: [
      { name: 'Node.js', level: 92 },
      { name: 'Python', level: 85 },
      { name: 'Java', level: 75 },
      { name: 'Express', level: 90 },
      { name: 'Django', level: 80 },
    ],
  },
  {
    title: 'Database',
    color: '#10b981',
    skills: [
      { name: 'PostgreSQL', level: 88 },
      { name: 'MongoDB', level: 85 },
      { name: 'Redis', level: 82 },
      { name: 'MySQL', level: 80 },
    ],
  },
  {
    title: 'DevOps & Tools',
    color: '#f59e0b',
    skills: [
      { name: 'Docker', level: 88 },
      { name: 'AWS', level: 82 },
      { name: 'Git', level: 95 },
      { name: 'CI/CD', level: 85 },
      { name: 'Kubernetes', level: 75 },
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
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 10px ${color}40`,
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
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-50px' });

  const activeSkills = skillCategories.find((c) => c.title === activeCategory);

  return (
    <SectionWrapper id="skills">
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[#00d4ff] text-sm font-mono tracking-wider uppercase mb-3"
        >
          Technologies I work with
        </motion.p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Skills & <span className="text-[#00d4ff] glow-text-blue">Expertise</span>
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
                    backgroundColor: `${category.color}20`,
                    border: `1px solid ${category.color}40`,
                    color: category.color,
                    boxShadow: `0 0 15px ${category.color}15`,
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
              'GraphQL', 'REST API', 'Figma', 'Jest', 'Cypress', 'Prisma',
              'Linux', 'Nginx', 'Terraform', 'RabbitMQ', 'Elasticsearch',
              'Storybook', 'Webpack', 'Vite', 'Sass', 'Redux',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs rounded-lg text-gray-400 bg-white/5 border border-white/5 hover:border-[#00d4ff]/30 hover:text-[#00d4ff] transition-colors duration-200 cursor-default"
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
