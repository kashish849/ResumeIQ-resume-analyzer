const BASE = import.meta.env.VITE_API_URL || '/api';

async function parseJsonSafely(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: text || 'Unexpected response from the server.' };
  }
}

async function request(path, options) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, options);
  } catch {
    throw new Error(
      'Unable to connect to the ResumeIQ server. Please make sure the backend is running.'
    );
  }

  const data = await parseJsonSafely(res);
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong on the ResumeIQ server. Please try again.');
  }
  return data;
}

export function parseResume({ file }) {
  const form = new FormData();
  form.append('resume', file);
  return request('/parse-resume', { method: 'POST', body: form });
}

export function analyzeResume({ file, jobDescription }) {
  const form = new FormData();
  form.append('resume', file);
  if (jobDescription) form.append('jobDescription', jobDescription);
  return request('/analyze', { method: 'POST', body: form });
}

export function matchJob({ resumeText, jobDescription }) {
  return request('/job-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription }),
  });
}

export function fetchTemplates() {
  return request('/templates', { method: 'GET' });
}

export async function exportReport({ fileName, analysis, jobMatch }) {
  const res = await fetch(`${BASE}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, analysis, jobMatch }),
  });
  if (!res.ok) {
    const data = await parseJsonSafely(res);
    throw new Error(data.error || 'Unable to export the report right now.');
  }
  return res.blob();
}
