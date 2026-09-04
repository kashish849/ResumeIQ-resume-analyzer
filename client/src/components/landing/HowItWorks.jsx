const steps = [
  { n: '01', title: 'Upload resume', desc: 'Drop in your PDF — we parse contact info, sections, skills and experience.' },
  { n: '02', title: 'Add target job', desc: 'Paste a job description so we can score you against what actually matters.' },
  { n: '03', title: 'Analyze', desc: 'Get an ATS score, a job match percentage, and a full section-by-section breakdown.' },
  { n: '04', title: 'Improve & apply', desc: 'Work through prioritized recommendations, then export a clean report.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        How it works
      </h2>

      <div className="mt-12 grid gap-10 md:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="relative">
            <p className="font-display text-sm font-semibold text-primary">{s.n}</p>
            <h3 className="mt-3 font-display text-lg font-semibold text-text">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            {i < steps.length - 1 && (
              <div className="mt-6 hidden h-px w-full bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
