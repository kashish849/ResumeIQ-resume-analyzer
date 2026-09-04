import { FileText, Eye, Trash2 } from 'lucide-react';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function RecentAnalyses({ rows, onView, onDelete }) {
  if (!rows.length) {
    return (
      <div className="card flex flex-col items-center gap-2 p-10 text-center">
        <FileText size={28} className="text-muted" />
        <p className="text-sm font-medium text-text">No analyses yet</p>
        <p className="text-sm text-muted">Upload a resume to see your first score here.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-5 py-3 font-medium">Resume</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">ATS score</th>
              <th className="px-5 py-3 font-medium">Job match</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-2/50">
                <td className="px-5 py-3.5 font-medium text-text">{r.fileName}</td>
                <td className="px-5 py-3.5 text-muted">{formatDate(r.date)}</td>
                <td className="px-5 py-3.5 text-text">{r.score}</td>
                <td className="px-5 py-3.5 text-muted">{r.matchScore != null ? `${r.matchScore}%` : '—'}</td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onView(r)} className="text-muted hover:text-primary" aria-label="View analysis">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => onDelete(r.id)} className="text-muted hover:text-danger" aria-label="Delete analysis">
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
  );
}
