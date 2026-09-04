import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const SECTION_HEADERS = {
  summary: /^(summary|professional summary|objective|profile)$/i,
  skills: /^(skills|technical skills|core competencies)$/i,
  experience: /^(experience|work experience|professional experience|employment)$/i,
  education: /^(education|academic background)$/i,
  projects: /^(projects|personal projects|academic projects)$/i,
  certifications: /^(certifications|licenses & certifications|certificates)$/i,
};

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d{1,3}[\s.-]?)?\(?\d{3,4}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}/;
const LINKEDIN_RE = /linkedin\.com\/[a-zA-Z0-9\-_/]+/i;
const GITHUB_RE = /github\.com\/[a-zA-Z0-9\-_/]+/i;
const URL_RE = /https?:\/\/[^\s)]+/i;

export async function parsePdfBuffer(buffer) {
  let data;
  try {
    data = await pdfParse(buffer);
  } catch (err) {
    const error = new Error('Your PDF could not be read. Try uploading a text-based PDF (not a scanned image).');
    error.publicMessage = error.message;
    error.status = 422;
    throw error;
  }

  const rawText = (data.text || '').trim();
  if (!rawText || rawText.length < 40) {
    const error = new Error('This PDF appears to have no extractable text. Scanned/image-only resumes are not supported yet.');
    error.publicMessage = error.message;
    error.status = 422;
    throw error;
  }

  return {
    rawText,
    pageCount: data.numpages,
    contact: extractContact(rawText),
    sections: extractSections(rawText),
    wordCount: rawText.split(/\s+/).filter(Boolean).length,
  };
}

function extractContact(text) {
  const email = text.match(EMAIL_RE)?.[0] || null;
  const phone = text.match(PHONE_RE)?.[0] || null;
  const linkedin = text.match(LINKEDIN_RE)?.[0] || null;
  const github = text.match(GITHUB_RE)?.[0] || null;
  const otherUrl = text.match(URL_RE)?.[0] || null;
  const firstLine = text.split('\n').map((l) => l.trim()).find(Boolean) || '';
  // Heuristic: the resume's name is usually the first non-empty line, if it
  // doesn't look like an email/phone/url itself.
  const name = /@|http|\d{5,}/.test(firstLine) ? null : firstLine.slice(0, 60);

  return {
    name,
    email,
    phone,
    linkedin,
    github: github || (otherUrl && !linkedin ? otherUrl : null),
  };
}

function extractSections(text) {
  const lines = text.split('\n').map((l) => l.trim());
  const sections = {};
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (currentKey) {
      sections[currentKey] = (sections[currentKey] || '') + buffer.join('\n') + '\n';
    }
    buffer = [];
  };

  for (const line of lines) {
    const matchedKey = Object.entries(SECTION_HEADERS).find(([, re]) => re.test(line.trim()))?.[0];
    if (matchedKey) {
      flush();
      currentKey = matchedKey;
      continue;
    }
    if (currentKey) buffer.push(line);
  }
  flush();

  return sections;
}
