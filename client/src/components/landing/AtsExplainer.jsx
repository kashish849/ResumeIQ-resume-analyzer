const rows = [
  { label: 'Formatting', v: 92 },
  { label: 'Keywords', v: 84 },
  { label: 'Skills', v: 91 },
  { label: 'Experience', v: 86 },
  { label: 'Readability', v: 89 },
];

export default function AtsExplainer() {
  return (
    <section id="ats" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            What is an ATS score, really?
          </h2>
          <p className="mt-4 max-w-md text-muted">
            Most companies filter resumes through an applicant tracking system before a human
            ever reads them. Our ATS-style score estimates how well your resume would survive
            that first pass — formatting, section structure, keyword coverage and clarity.
          </p>
          <p className="mt-3 max-w-md text-sm text-muted">
            This is ResumeIQ's own scoring model — it doesn't represent any specific company's
            actual ATS software.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-sm text-muted">Overall score</p>
            <p className="font-display text-3xl font-bold text-text">87 / 100</p>
          </div>
          <div className="mt-6 space-y-4">
            {rows.map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-text">{r.label}</span>
                  <span className="text-muted">{r.v}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${r.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
