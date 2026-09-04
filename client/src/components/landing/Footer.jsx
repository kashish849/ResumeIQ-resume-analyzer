export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <p className="font-display font-semibold text-text">ResumeIQ</p>
        <p>© {new Date().getFullYear()} ResumeIQ. Built as a portfolio project.</p>
      </div>
    </footer>
  );
}
