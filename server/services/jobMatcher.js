import { detectSkills } from '../utils/skills.js';
import { matchKeywords } from './atsEngine.js';

export function runJobMatch({ resumeText, jobDescription }) {
  const keywordAnalysis = matchKeywords(resumeText, jobDescription);
  const resumeSkills = new Set(Object.values(detectSkills(resumeText)).flat());
  const jdSkills = new Set(Object.values(detectSkills(jobDescription)).flat());

  const matchingSkills = [...jdSkills].filter((s) => resumeSkills.has(s));
  const missingSkills = [...jdSkills].filter((s) => !resumeSkills.has(s));

  const skillMatchPct = jdSkills.size ? Math.round((matchingSkills.length / jdSkills.size) * 100) : 100;
  const overallMatch = Math.round(keywordAnalysis.score * 0.6 + skillMatchPct * 0.4);

  return {
    matchPercentage: Math.min(100, overallMatch),
    keywordMatch: keywordAnalysis.score,
    skillMatchPercentage: skillMatchPct,
    matchingKeywords: keywordAnalysis.matching,
    missingKeywords: keywordAnalysis.missing,
    matchingSkills,
    missingSkills,
  };
}
