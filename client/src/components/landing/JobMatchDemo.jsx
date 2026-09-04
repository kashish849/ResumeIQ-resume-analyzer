const matching = ['React', 'JavaScript', 'REST API', 'Git', 'Testing'];
const missing = ['TypeScript', 'Jest', 'CI/CD'];

export default function JobMatchDemo() {
  return (
    <section id="job-match" className="border-y border-border bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
              See exactly where you match
            </h2>
            <p className="mt-4 max-w-md text-muted">
              Paste any job description and we'll compare it against your resume — matching
              skills, missing keywords, and an overall fit percentage.
            </p>

            <div className="mt-8 flex gap-10">
              <div>
                <p className="text-sm text-muted">Resume</p>
                <p className="font-display text-3xl font-bold text-text">78%</p>
              </div>
              <div>
                <p className="text-sm text-muted">Job match</p>
                <p className="font-display text-3xl font-bold text-primary">92%</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <p className="text-sm font-medium text-text">Matching keywords</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {matching.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success"
                >
                  {k}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm font-medium text-text">Missing</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {missing.map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
