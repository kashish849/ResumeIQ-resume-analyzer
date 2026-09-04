import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  'Reading resume',
  'Extracting sections',
  'Checking ATS compatibility',
  'Detecting skills',
  'Matching keywords',
  'Generating recommendations',
];

export default function ProcessingSteps({ activeIndex }) {
  return (
    <div className="card p-6">
      <ul className="space-y-4">
        {STEPS.map((label, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? 'border-success bg-success/10 text-success'
                    : active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted'
                }`}
              >
                {done ? (
                  <Check size={13} />
                ) : active ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <motion.span
                animate={{ opacity: done || active ? 1 : 0.5 }}
                className={`text-sm ${done || active ? 'text-text' : 'text-muted'}`}
              >
                {label}
              </motion.span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
