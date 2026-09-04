import { Link } from 'react-router-dom';
import { FileScan, Target, Sparkles, LayoutTemplate } from 'lucide-react';

const actions = [
  { to: '/dashboard/analyze', label: 'Analyze resume', icon: FileScan },
  { to: '/dashboard/job-matcher', label: 'Match job', icon: Target },
  { to: '/dashboard/analyze', label: 'Improve resume', icon: Sparkles },
  { to: '/dashboard/templates', label: 'Resume templates', icon: LayoutTemplate },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {actions.map(({ to, label, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          className="card flex flex-col items-start gap-3 p-4 transition-shadow hover:shadow-[0_16px_40px_-24px_rgb(0_0_0_/_0.4)]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={17} />
          </div>
          <span className="text-sm font-medium text-text">{label}</span>
        </Link>
      ))}
    </div>
  );
}
