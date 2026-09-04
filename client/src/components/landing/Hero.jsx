import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

function AnimatedNumber({ value, suffix = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      {value}
      {suffix}
    </motion.span>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-6 pb-20 pt-14 md:grid-cols-[1.1fr_0.9fr] md:pb-32 md:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <h1 className="font-display text-[2.75rem] font-bold leading-[1.08] tracking-tight text-text sm:text-6xl">
          Build a resume that gets noticed.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
          Analyze your resume, improve your ATS score and tailor every application to the job
          you actually want.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link to="/signup" className="btn-primary px-6 py-3 text-base">
            Analyze my resume
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-1.5 text-base font-medium text-text hover:text-primary transition-colors"
          >
            See how it works
            <ArrowUpRight size={18} />
          </a>
        </div>

        <div className="mt-12 flex items-center gap-6 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-success" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-success" /> Free ATS check
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className="relative md:mt-6"
      >
        <div className="card relative overflow-hidden p-6 shadow-[0_20px_60px_-25px_rgb(0_0_0_/_0.35)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Resume score</p>
              <p className="font-display text-4xl font-bold text-text">
                <AnimatedNumber value="87" suffix="/100" />
              </p>
            </div>
            <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Good
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: 'Formatting', v: 92 },
              { label: 'Keywords', v: 84 },
              { label: 'Skills', v: 91 },
              { label: 'Experience', v: 86 },
            ].map((row, i) => (
              <div key={row.label}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{row.label}</span>
                  <span>{row.v}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.v}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
            <p className="text-sm text-muted">Job match</p>
            <p className="font-display text-lg font-semibold text-text">92%</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card absolute -bottom-6 -left-6 hidden w-52 p-4 sm:block"
        >
          <p className="text-xs text-muted">Missing keyword</p>
          <p className="mt-1 text-sm font-medium text-text">TypeScript</p>
          <p className="mt-1 text-xs text-muted">Appears 6× in the job description</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
