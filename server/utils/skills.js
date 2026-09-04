// Extensible skill taxonomy. Add new entries per category as needed —
// nothing else in the codebase needs to change to pick them up.
export const SKILL_CATEGORIES = {
  Languages: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'kotlin', 'swift'],
  Frontend: ['react', 'vue', 'angular', 'next.js', 'nextjs', 'html', 'css', 'tailwind', 'redux', 'framer motion', 'sass'],
  Backend: ['node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'rest api', 'graphql', 'fastapi', '.net'],
  Database: ['postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'supabase', 'firebase', 'dynamodb'],
  Tools: ['git', 'github', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'aws', 'azure', 'gcp', 'linux', 'jira', 'figma'],
  Testing: ['jest', 'mocha', 'cypress', 'playwright', 'testing library', 'pytest', 'unit testing'],
  'Soft Skills': ['leadership', 'communication', 'problem solving', 'teamwork', 'collaboration', 'mentoring', 'ownership'],
};

export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

export const WEAK_PHRASES = [
  'responsible for',
  'worked on',
  'helped with',
  'participated in',
  'was involved in',
  'assisted with',
  'in charge of',
  'tasked with',
];

export const STRONG_VERBS = [
  'developed', 'built', 'led', 'improved', 'automated', 'optimized', 'implemented',
  'designed', 'launched', 'architected', 'reduced', 'increased', 'delivered',
  'streamlined', 'spearheaded', 'engineered', 'scaled', 'migrated',
];

export function detectSkills(text) {
  const lower = text.toLowerCase();
  const found = {};
  for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
    const matches = skills.filter((skill) => lower.includes(skill));
    if (matches.length) found[category] = matches;
  }
  return found;
}
