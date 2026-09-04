import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Download, Loader2 } from 'lucide-react';
import ScoreRing from '../../components/dashboard/ScoreRing.jsx';
import { exportReport } from '../../services/api.js';
import { useToast } from '../../components/Toast.jsx';

const PRIORITY_STYLE = {
  HIGH: 'bg-danger/10 text-danger border-danger/30',
  MEDIUM: 'bg-warning/10 text-warning border-warning/30',
  LOW: 'bg-muted/10 text-muted border-border',
};

const BREAKDOWN_LABELS = {
  atsCompatibility: 'ATS compatibility',
  keywords: 'Keywords',
  skills: 'Skills',
  experience: 'Experience',
  formatting: 'Formatting',
  sections: 'Sections',
  readability: 'Readability',
};

export default function Results() {
  const [data, setData] = useState(undefined);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const raw = sessionStorage.getItem('resumeiq-last-analysis');
    setData(raw ? JSON.parse(raw) : null);
  }, []);

  async function handleExport() {
    setExporting(true);
    try {
      const blob = await exportReport({
        fileName: data.fileName,
        analysis: data.analysis,
        jobMatch: data.jobMatch,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(data.fileName || 'resume').replace(/\.pdf$/i, '')}-resumeiq-report.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setExporting(false);
    }
  }

  if (data === undefined) return null;

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="font-display text-lg font-semibold text-text">No analysis to show yet</p>
        <p className="mt-2 text-sm text-muted">Run a new analysis to see your results here.</p>
        <Link to="/dashboard/analyze" className="btn-primary mt-6 inline-flex px-5 py-2.5">
          Analyze a resume
        </Link>
      </div>
    );
  }

  const { analysis, jobMatch, fileName } = data;

  if (!analysis || typeof analysis.overall !== 'number') {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <p className="font-display text-lg font-semibold text-text">This analysis couldn't be loaded</p>
        <p className="mt-2 text-sm text-muted">
          The saved result looks incomplete. Try running the analysis again.
        </p>
        <Link to="/dashboard/analyze" className="btn-primary mt-6 inline-flex px-5 py-2.5">
          Analyze a resume
        </Link>
      </div>
    );
  }

  const breakdown = analysis.breakdown || {};
  const strengths = analysis.strengths || [];
  const issues = analysis.issues || [];
  const recommendations = analysis.recommendations || [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{fileName}</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text">Analysis results</h1>
        </div>
        <button onClick={handleExport} disabled={exporting} className="btn-secondary px-4 py-2.5">
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Download report
        </button>
      </div>

      <div className="card flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
        <ScoreRing score={analysis.overall} size={140} />
        <div className="flex-1 space-y-1 text-center sm:text-left">
          <p className="font-display text-lg font-semibold text-text">{analysis.label}</p>
          {jobMatch && (
            <p className="text-sm text-muted">
              Job match: <span className="font-semibold text-primary">{jobMatch.matchPercentage}%</span>
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-text">Score breakdown</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Object.entries(breakdown).map(([key, v]) => (
            <div key={key} className="card p-4">
              <p className="text-xs text-muted">{BREAKDOWN_LABELS[key] || key}</p>
              <p className="mt-1 font-display text-xl font-bold text-text">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-text">Strengths</p>
          <ul className="mt-4 space-y-3">
            {strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-text">Issues</p>
          <ul className="mt-4 space-y-3">
            {issues.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-warning" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {jobMatch && (
        <div className="card p-6">
          <p className="font-display text-base font-semibold text-text">Keyword match</p>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Matching</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobMatch.matchingKeywords.map((k) => (
                <span key={k} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  {k}
                </span>
              ))}
              {!jobMatch.matchingKeywords.length && <p className="text-sm text-muted">None found.</p>}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Missing</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {jobMatch.missingKeywords.map((k) => (
                <span key={k} className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                  {k}
                </span>
              ))}
              {!jobMatch.missingKeywords.length && <p className="text-sm text-muted">None — great coverage.</p>}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-text">Recommendations</p>
        <div className="space-y-3">
          {recommendations.map((r, i) => (
            <div key={i} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLE[r.priority]}`}>
                  {r.priority}
                </span>
                <span className="text-xs text-muted">{r.category}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-text">{r.problem}</p>
              <p className="mt-1 text-sm text-muted">{r.explanation}</p>
              <p className="mt-2 text-sm text-text">
                <span className="font-medium">Suggested action: </span>
                {r.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
