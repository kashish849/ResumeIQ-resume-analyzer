import ScoreRing from './ScoreRing.jsx';

const LABELS = {
  atsCompatibility: 'ATS compatibility',
  formatting: 'Formatting',
  keywords: 'Keywords',
  skills: 'Skills',
  experience: 'Experience',
  sections: 'Sections',
  readability: 'Readability',
};

const DEMO_BREAKDOWN = {
  atsCompatibility: 92,
  formatting: 88,
  keywords: 84,
  skills: 91,
  experience: 86,
  sections: 95,
  readability: 89,
};

export default function ResumeHealth({ score = 0, breakdown }) {
  const rows = Object.entries(breakdown || DEMO_BREAKDOWN);

  return (
    <div className="card p-6">
      <p className="font-display text-lg font-semibold text-text">Resume health</p>
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <ScoreRing score={score} />
        <div className="w-full flex-1 space-y-3">
          {rows.map(([key, v]) => (
            <div key={key}>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{LABELS[key] || key}</span>
                <span>{v}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
