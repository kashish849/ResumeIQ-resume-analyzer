const KEY = 'resumeiq-history';
const MAX_ITEMS = 50;

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addHistoryEntry({ fileName, analysis, jobMatch }) {
  const entries = getHistory();
  const entry = {
    id: crypto.randomUUID(),
    fileName,
    date: new Date().toISOString(),
    score: analysis.overall,
    matchScore: jobMatch ? jobMatch.matchPercentage : null,
    analysis,
    jobMatch,
  };
  entries.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ITEMS)));
  return entry;
}

export function deleteHistoryEntry(id) {
  const entries = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(entries));
  return entries;
}
