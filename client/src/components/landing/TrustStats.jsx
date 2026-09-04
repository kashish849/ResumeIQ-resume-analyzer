const stats = [
  { value: '10K+', label: 'Resumes analyzed' },
  { value: '95%', label: 'Faster feedback' },
  { value: 'ATS', label: 'Focused analysis' },
  { value: 'Privacy', label: 'First architecture' },
];

export default function TrustStats() {
  return (
    <section className="border-y border-border bg-surface-2/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-muted">Built for modern job seekers</p>
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-bold text-text">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
