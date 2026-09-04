import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Eye, Trash2 } from 'lucide-react';
import { getHistory, deleteHistoryEntry } from '../../lib/history.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function History() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const visible = useMemo(() => {
    let list = entries.filter((e) => e.fileName.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sort === 'oldest') list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sort === 'highest') list = [...list].sort((a, b) => b.score - a.score);
    if (sort === 'lowest') list = [...list].sort((a, b) => a.score - b.score);
    return list;
  }, [entries, query, sort]);

  function handleView(entry) {
    sessionStorage.setItem(
      'resumeiq-last-analysis',
      JSON.stringify({ fileName: entry.fileName, analysis: entry.analysis, jobMatch: entry.jobMatch })
    );
    navigate('/dashboard/results');
  }

  function handleDelete(id) {
    setEntries(deleteHistoryEntry(id));
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Analysis history</h1>
        <p className="mt-1 text-sm text-muted">Every resume you've analyzed in this browser.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            className="input pl-9"
            placeholder="Search by file name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest score</option>
          <option value="lowest">Lowest score</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-12 text-center">
          <FileText size={28} className="text-muted" />
          <p className="text-sm font-medium text-text">
            {entries.length ? 'No results match your search' : 'No analyses yet'}
          </p>
          <p className="text-sm text-muted">
            {entries.length ? 'Try a different search term.' : 'Run your first analysis to see it here.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Resume</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">ATS score</th>
                  <th className="px-5 py-3 font-medium">Job match</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                    <td className="px-5 py-3.5 font-medium text-text">{r.fileName}</td>
                    <td className="px-5 py-3.5 text-muted">{formatDate(r.date)}</td>
                    <td className="px-5 py-3.5 text-text">{r.score}</td>
                    <td className="px-5 py-3.5 text-muted">{r.matchScore != null ? `${r.matchScore}%` : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.score >= 85
                            ? 'bg-success/10 text-success'
                            : r.score >= 70
                            ? 'bg-primary/10 text-primary'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {r.score >= 85 ? 'Excellent' : r.score >= 70 ? 'Good' : 'Needs work'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleView(r)} className="text-muted hover:text-primary" aria-label="View analysis">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="text-muted hover:text-danger" aria-label="Delete analysis">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
