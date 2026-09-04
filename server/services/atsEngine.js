import { detectSkills, WEAK_PHRASES, STRONG_VERBS } from '../utils/skills.js';

// Transparent, documented weighting — mirrors the breakdown shown in the UI.
// This is a ResumeIQ ATS-style score, not a simulation of any specific
// company's actual applicant tracking system.
const WEIGHTS = {
  atsCompatibility: 0.20,
  keywords: 0.20,
  skills: 0.15,
  experience: 0.15,
  formatting: 0.10,
  sections: 0.10,
  readability: 0.10,
};

export function runAtsAnalysis({ parsedResume, jobDescription }) {
  const { rawText, sections, contact, wordCount } = parsedResume;

  const sectionScore = scoreSections(sections);
  const formattingScore = scoreFormatting(rawText, wordCount);
  const contactScore = scoreContact(contact);
  const skillsFound = detectSkills(rawText);
  const skillsScore = scoreSkills(skillsFound);
  const experienceAnalysis = analyzeExperience(sections.experience || rawText);
  const readabilityScore = scoreReadability(rawText, wordCount);
  const keywordAnalysis = jobDescription
    ? matchKeywords(rawText, jobDescription)
    : { score: 70, matching: [], missing: [], note: 'No job description provided — scored on general ATS keyword density.' };
  // ATS compatibility blends contact completeness + section presence, since
  // that's what most real parsers choke on first.
  const atsCompatibilityScore = Math.round((contactScore + sectionScore) / 2);

  const breakdown = {
    atsCompatibility: atsCompatibilityScore,
    keywords: keywordAnalysis.score,
    skills: skillsScore,
    experience: experienceAnalysis.score,
    formatting: formattingScore,
    sections: sectionScore,
    readability: readabilityScore,
  };

  const overall = Math.round(
    Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + breakdown[key] * weight, 0)
  );

  return {
    overall,
    label: scoreLabel(overall),
    breakdown,
    weights: WEIGHTS,
    contact,
    skillsFound,
    experienceAnalysis,
    keywordAnalysis,
    strengths: buildStrengths({ breakdown, contact, skillsFound }),
    issues: buildIssues({ breakdown, contact, experienceAnalysis, keywordAnalysis }),
    recommendations: buildRecommendations({ breakdown, contact, experienceAnalysis, keywordAnalysis, sections }),
  };
}

function scoreLabel(score) {
  if (score >= 85) return 'Excellent — highly competitive';
  if (score >= 70) return 'Good — strong foundation';
  if (score >= 50) return 'Fair — needs targeted improvement';
  return 'Needs work — several gaps to close';
}

function scoreContact({ email, phone, linkedin, github }) {
  const checks = [Boolean(email), Boolean(phone), Boolean(linkedin), Boolean(github)];
  const present = checks.filter(Boolean).length;
  return Math.round((present / checks.length) * 100);
}

function scoreSections(sections) {
  const expected = ['summary', 'skills', 'experience', 'education', 'projects', 'certifications'];
  const present = expected.filter((key) => sections[key] && sections[key].trim().length > 0);
  // Summary/skills/experience/education matter more than projects/certs.
  const weighted = ['summary', 'skills', 'experience', 'education'].filter((k) => present.includes(k)).length * 20
    + ['projects', 'certifications'].filter((k) => present.includes(k)).length * 10;
  return Math.min(100, weighted);
}

function scoreFormatting(rawText, wordCount) {
  let score = 100;
  const symbolDensity = (rawText.match(/[^\w\s.,;:()\-/&%@]/g) || []).length / Math.max(rawText.length, 1);
  if (symbolDensity > 0.02) score -= 15;
  const excessiveWhitespace = /\n{4,}/.test(rawText);
  if (excessiveWhitespace) score -= 10;
  if (wordCount < 150) score -= 25; // likely too sparse for ATS parsing
  if (wordCount > 1200) score -= 15; // likely too dense / multi-page bloat
  const lines = rawText.split('\n').filter(Boolean);
  const veryLongLines = lines.filter((l) => l.length > 220).length;
  if (veryLongLines > 3) score -= 10;
  return Math.max(0, Math.round(score));
}

function scoreSkills(skillsFound) {
  const categoriesHit = Object.keys(skillsFound).length;
  const totalSkills = Object.values(skillsFound).flat().length;
  // Reward breadth across categories more than raw count.
  const categoryScore = Math.min(60, categoriesHit * 12);
  const countScore = Math.min(40, totalSkills * 3);
  return Math.min(100, categoryScore + countScore);
}

function analyzeExperience(experienceText) {
  const text = experienceText.toLowerCase();
  const weakHits = WEAK_PHRASES.filter((phrase) => text.includes(phrase));
  const strongHits = STRONG_VERBS.filter((verb) => text.includes(verb));
  const hasNumbers = /\d+%|\$\d+|\d+x|\d+\+/.test(experienceText);
  const bulletCount = (experienceText.match(/\n\s*[-•*]/g) || []).length;

  let score = 60;
  score += Math.min(20, strongHits.length * 4);
  score -= Math.min(25, weakHits.length * 6);
  score += hasNumbers ? 15 : 0;
  score += bulletCount >= 3 ? 5 : 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    weakPhrasesFound: weakHits,
    strongVerbsFound: strongHits,
    hasQuantifiedResults: hasNumbers,
    bulletCount,
  };
}

function scoreReadability(rawText, wordCount) {
  const sentences = rawText.split(/[.!?]\s/).filter((s) => s.trim().length > 3);
  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : wordCount;
  let score = 100;
  if (avgWordsPerSentence > 28) score -= 20; // likely dense paragraph-style bullets
  if (avgWordsPerSentence < 4) score -= 10; // fragments with little info
  if (wordCount < 150) score -= 15;
  return Math.max(0, Math.round(score));
}

export function matchKeywords(resumeText, jobDescription) {
  const jdWords = extractKeywords(jobDescription);
  const resumeLower = resumeText.toLowerCase();

  const matching = jdWords.filter((word) => resumeLower.includes(word));
  const missing = jdWords.filter((word) => !resumeLower.includes(word));

  const total = jdWords.length || 1;
  const score = Math.round((matching.length / total) * 100);

  return {
    score: Math.min(100, score),
    matching: dedupeCase(matching).slice(0, 20),
    missing: dedupeCase(missing).slice(0, 15),
  };
}

function extractKeywords(jobDescription) {
  const STOPWORDS = new Set([
    'the', 'and', 'for', 'with', 'you', 'your', 'are', 'will', 'this', 'that',
    'have', 'from', 'our', 'a', 'an', 'to', 'of', 'in', 'on', 'as', 'is', 'be',
    'we', 'or', 'at', 'by', 'it', 'their', 'they', 'who', 'role', 'team',
  ]);
  const words = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s/-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([w]) => w);
}

function dedupeCase(arr) {
  return [...new Set(arr)];
}

function buildStrengths({ breakdown, contact, skillsFound }) {
  const strengths = [];
  if (breakdown.skills >= 70) strengths.push('Strong, well-categorized technical skill set');
  if (breakdown.sections >= 80) strengths.push('Clear, complete section structure');
  if (breakdown.experience >= 75) strengths.push('Good use of strong action verbs in experience bullets');
  if (contact.email && contact.phone) strengths.push('Contact information is complete and easy to find');
  if (breakdown.formatting >= 85) strengths.push('Clean, ATS-friendly formatting');
  if (Object.keys(skillsFound).length >= 4) strengths.push('Skills span multiple relevant categories');
  if (!strengths.length) strengths.push('Resume was successfully parsed and contains identifiable sections');
  return strengths.slice(0, 5);
}

function buildIssues({ breakdown, contact, experienceAnalysis, keywordAnalysis }) {
  const issues = [];
  if (!experienceAnalysis.hasQuantifiedResults) issues.push('Missing measurable, quantified achievements in experience bullets');
  if (keywordAnalysis.missing?.length) issues.push('Some important job-description keywords are absent from the resume');
  if (experienceAnalysis.weakPhrasesFound.length) issues.push('Weak, passive phrasing found in experience bullets');
  if (!contact.linkedin) issues.push('No LinkedIn profile detected');
  if (breakdown.sections < 60) issues.push('One or more core resume sections appear to be missing');
  if (breakdown.readability < 60) issues.push('Sentence length and density may hurt readability for both ATS and recruiters');
  if (!issues.length) issues.push('No major issues detected — focus on fine-tuning for your target role');
  return issues.slice(0, 6);
}

function buildRecommendations({ breakdown, contact, experienceAnalysis, keywordAnalysis, sections }) {
  const recs = [];

  if (!experienceAnalysis.hasQuantifiedResults) {
    recs.push({
      priority: 'HIGH',
      category: 'Experience',
      problem: 'Experience bullets lack measurable results',
      explanation: 'Quantified impact (%, $, time saved, scale) is one of the strongest signals recruiters and ATS scoring both look for.',
      action: 'Add measurable results to your experience bullets, e.g. "Improved page load time by 30%."',
    });
  }

  if (keywordAnalysis.missing?.length) {
    recs.push({
      priority: 'HIGH',
      category: 'Keywords',
      problem: 'Several job-description keywords are missing',
      explanation: `Terms like ${keywordAnalysis.missing.slice(0, 3).join(', ')} appear in the target job description but not in your resume.`,
      action: `Naturally work in relevant missing keywords such as ${keywordAnalysis.missing.slice(0, 3).join(', ')}, where truthful.`,
    });
  }

  if (experienceAnalysis.weakPhrasesFound.length) {
    recs.push({
      priority: 'MEDIUM',
      category: 'Wording',
      problem: 'Passive or vague phrasing detected',
      explanation: `Phrases like "${experienceAnalysis.weakPhrasesFound[0]}" undersell your ownership of the work.`,
      action: 'Replace weak phrases with strong action verbs like Developed, Led, Built, Automated, or Optimized.',
    });
  }

  if (!sections.summary) {
    recs.push({
      priority: 'MEDIUM',
      category: 'Structure',
      problem: 'No professional summary detected',
      explanation: 'A concise 2-3 line summary helps recruiters and ATS parsers quickly understand your profile.',
      action: 'Add a concise professional summary near the top of your resume.',
    });
  }

  if (!contact.linkedin) {
    recs.push({
      priority: 'LOW',
      category: 'Contact',
      problem: 'LinkedIn profile not found',
      explanation: 'Recruiters routinely cross-check LinkedIn; omitting it can look incomplete.',
      action: 'Add your LinkedIn URL near your contact details.',
    });
  }

  if (breakdown.skills < 60) {
    recs.push({
      priority: 'MEDIUM',
      category: 'Skills',
      problem: 'Skills section could be broader',
      explanation: 'Your resume currently shows relevant strength in only a few skill categories.',
      action: 'Move technical skills closer to the top and expand coverage across languages, tools, and frameworks you actually use.',
    });
  }

  return recs.slice(0, 6);
}
