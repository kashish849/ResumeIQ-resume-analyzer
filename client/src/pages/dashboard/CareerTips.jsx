import { useState } from 'react';

const CATEGORIES = ['All', 'Resume', 'ATS', 'Interview', 'LinkedIn', 'Job search', 'Career growth'];

const TIPS = [
  { category: 'Resume', title: 'Lead with impact, not duties', body: 'Start bullets with what changed because of your work, not just what you were assigned.' },
  { category: 'Resume', title: 'Keep it to one page early career', body: 'Recruiters spend seconds on a first pass — density beats length.' },
  { category: 'ATS', title: 'Use standard section headings', body: '"Experience" and "Education" parse more reliably than creative alternatives.' },
  { category: 'ATS', title: 'Avoid tables and text boxes', body: 'Many parsers read these out of order or skip them entirely.' },
  { category: 'Interview', title: 'Prepare three specific stories', body: 'Have a challenge, a conflict, and a failure story ready — with real numbers.' },
  { category: 'LinkedIn', title: 'Match your headline to your target role', body: 'A generic "Student" headline undersells what recruiters are searching for.' },
  { category: 'Job search', title: 'Tailor per application', body: 'Even small keyword adjustments per job description meaningfully change match rates.' },
  { category: 'Career growth', title: 'Track wins as they happen', body: "Log achievements monthly — you won't remember specifics a year later." },
];

export default function CareerTips() {
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? TIPS : TIPS.filter((t) => t.category === active);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Career tips</h1>
        <p className="mt-1 text-sm text-muted">Short, practical advice across the job search.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === c
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted hover:text-text'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((t) => (
          <div key={t.title} className="card p-5">
            <span className="text-xs font-medium text-primary">{t.category}</span>
            <p className="mt-2 font-display font-semibold text-text">{t.title}</p>
            <p className="mt-1.5 text-sm text-muted">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
