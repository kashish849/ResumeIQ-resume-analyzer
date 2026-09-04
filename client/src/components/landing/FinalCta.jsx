import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="card flex flex-col items-start gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl sm:max-w-md">
          Your next opportunity starts with a better resume.
        </h2>
        <Link to="/signup" className="btn-primary shrink-0 px-6 py-3 text-base">
          Analyze my resume
        </Link>
      </div>
    </section>
  );
}
