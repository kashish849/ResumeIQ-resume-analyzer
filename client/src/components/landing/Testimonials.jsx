const quotes = [
  { name: 'Priya S.', role: 'Frontend developer, demo content', text: 'Found three missing keywords I never would have guessed the ATS was filtering on.' },
  { name: 'Daniel R.', role: 'CS student, demo content', text: 'Rewrote my bullet points using the suggestions and my callback rate noticeably improved.' },
  { name: 'Meera K.', role: 'Career switcher, demo content', text: 'The section-by-section breakdown made it obvious my summary was the weak point.' },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        What people are saying
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {quotes.map((q) => (
          <div key={q.name} className="card p-6">
            <p className="text-sm leading-relaxed text-text">&ldquo;{q.text}&rdquo;</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-text">{q.name}</p>
              <p className="text-xs text-muted">{q.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
