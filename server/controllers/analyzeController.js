import fs from 'fs';
import { parsePdfBuffer } from '../services/resumeParser.js';
import { runAtsAnalysis } from '../services/atsEngine.js';
import { runJobMatch } from '../services/jobMatcher.js';
import { streamAnalysisReport } from '../services/reportGenerator.js';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Two-column layout with a bold accent header.' },
  { id: 'minimal', name: 'Minimal', description: 'Clean single-column layout, generous whitespace.' },
  { id: 'executive', name: 'Executive', description: 'Serif headings, formal structure for senior roles.' },
  { id: 'tech', name: 'Tech', description: 'Skills-forward layout tuned for engineering roles.' },
  { id: 'ats-classic', name: 'ATS Classic', description: 'Single column, no tables/graphics — maximum ATS safety.' },
  { id: 'creative', name: 'Creative', description: 'Subtle color accents for design-adjacent roles.' },
];

function readAndCleanup(filePath) {
  const buffer = fs.readFileSync(filePath);
  fs.unlink(filePath, () => {}); // best-effort cleanup, don't block the response
  return buffer;
}

export async function handleParseResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please attach a PDF resume to analyze.' });
    }
    const buffer = readAndCleanup(req.file.path);
    const parsed = await parsePdfBuffer(buffer);
    res.json({ fileName: req.file.originalname, parsed });
  } catch (err) {
    next(err);
  }
}

export async function handleAnalyze(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please attach a PDF resume to analyze.' });
    }
    const buffer = readAndCleanup(req.file.path);
    const parsedResume = await parsePdfBuffer(buffer);
    const jobDescription = req.body.jobDescription || '';

    const analysis = runAtsAnalysis({ parsedResume, jobDescription });
    const jobMatch = jobDescription.trim()
      ? runJobMatch({ resumeText: parsedResume.rawText, jobDescription })
      : null;

    res.json({
      fileName: req.file.originalname,
      analyzedAt: new Date().toISOString(),
      parsedResume: { contact: parsedResume.contact, wordCount: parsedResume.wordCount },
      analysis,
      jobMatch,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleJobMatch(req, res, next) {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required to calculate a match.' });
    }
    const jobMatch = runJobMatch({ resumeText, jobDescription });
    res.json({ jobMatch });
  } catch (err) {
    next(err);
  }
}

export function handleTemplates(req, res) {
  res.json({ templates: TEMPLATES });
}

export function handleReportExport(req, res, next) {
  try {
    const { fileName, analysis, jobMatch } = req.body;
    if (!analysis) {
      return res.status(400).json({ error: 'No analysis provided to export.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(fileName || 'resume').replace(/\.pdf$/i, '')}-resumeiq-report.pdf"`);
    streamAnalysisReport(res, { fileName, analysis, jobMatch });
  } catch (err) {
    next(err);
  }
}
