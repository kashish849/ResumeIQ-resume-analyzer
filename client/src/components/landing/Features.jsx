import { Target, Layers, Sparkles, KeyRound, ListChecks, HeartPulse } from 'lucide-react';

const features = [
  { icon: Target, title: 'ATS score', desc: 'Understand how compatible your resume is with applicant tracking systems.' },
  { icon: Layers, title: 'Job match', desc: 'Compare your resume against a specific job description.' },
  { icon: Sparkles, title: 'Skill intelligence', desc: 'Identify strengths, missing skills and relevant technologies.' },
  { icon: KeyRound, title: 'Keyword optimization', desc: "Discover important keywords you're missing." },
  { icon: ListChecks, title: 'Smart recommendations', desc: 'Get prioritized suggestions instead of generic advice.' },
  { icon: HeartPulse, title: 'Resume health', desc: 'See exactly which areas of your resume need improvement.' },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-lg">
        <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Everything you need to apply with confidence
        </h2>
        <p className="mt-4 text-muted">
          One analysis covers formatting, keywords, skills and experience — so you know exactly
          what to fix before you hit submit.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="card group p-6 transition-shadow hover:shadow-[0_16px_40px_-24px_rgb(0_0_0_/_0.4)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <Icon size={20} />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-text">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
