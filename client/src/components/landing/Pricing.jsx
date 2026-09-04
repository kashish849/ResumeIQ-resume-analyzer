import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['3 analyses', 'ATS score', 'Basic keyword analysis'],
  },
  {
    name: 'Pro',
    price: '$12',
    featured: true,
    features: ['Unlimited analyses', 'Job matching', 'Advanced recommendations', 'Export reports', 'Full analysis history'],
  },
  {
    name: 'Career',
    price: '$29',
    features: ['Everything in Pro', 'Advanced tailoring', 'Priority analysis', 'Career insights'],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
        Simple pricing
      </h2>
      <p className="mt-4 max-w-md text-muted">Start free. Upgrade when you need more.</p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`card p-7 ${p.featured ? 'border-primary ring-1 ring-primary' : ''}`}
          >
            <p className="font-display text-lg font-semibold text-text">{p.name}</p>
            <p className="mt-3">
              <span className="font-display text-3xl font-bold text-text">{p.price}</span>
              <span className="text-sm text-muted"> /month</span>
            </p>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className={`mt-8 block text-center ${p.featured ? 'btn-primary' : 'btn-secondary'}`}
            >
              Get started
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
