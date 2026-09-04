import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const items = [
  { q: 'What is ATS?', a: 'An Applicant Tracking System is software companies use to filter and rank resumes before a person reads them. Our score estimates how well your resume performs in that first pass.' },
  { q: 'Does ResumeIQ use MongoDB?', a: 'No. ResumeIQ runs on Supabase for authentication and data storage — no MongoDB dependency anywhere in the stack.' },
  { q: 'Is my resume stored?', a: 'Your resume and analysis history are stored securely under your account when Supabase is configured. Without it, everything stays local to your session.' },
  { q: 'What file formats are supported?', a: 'PDF resumes up to 8 MB.' },
  { q: 'How does job matching work?', a: 'Paste a job description and we compare it against your parsed resume to calculate keyword overlap, skill match and an overall fit percentage.' },
  { q: 'Can I use ResumeIQ on mobile?', a: 'Yes — the whole app, including the dashboard and analysis views, is fully responsive.' },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        Frequently asked questions
      </h2>

      <div className="mt-10 divide-y divide-border border-t border-border">
        {items.map((item, i) => (
          <div key={item.q}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={open === i}
            >
              <span className="font-medium text-text">{item.q}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-muted transition-transform ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
