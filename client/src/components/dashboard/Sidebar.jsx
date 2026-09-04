import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileScan, Target, History, LayoutTemplate,
  GraduationCap, Settings, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/analyze', label: 'Analyze resume', icon: FileScan },
  { to: '/dashboard/job-matcher', label: 'Job matcher', icon: Target },
  { to: '/dashboard/history', label: 'History', icon: History },
  { to: '/dashboard/templates', label: 'Resume templates', icon: LayoutTemplate },
  { to: '/dashboard/tips', label: 'Career tips', icon: GraduationCap },
];

export default function Sidebar({ open, onClose }) {
  const { user, signOut } = useAuth();
  const initials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-surface transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="font-display text-lg font-bold text-text">ResumeIQ</span>
          <button className="text-muted md:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border px-3 py-4">
          <NavLink
            to="/dashboard/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface-2 hover:text-text'
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">
                {user?.user_metadata?.full_name || 'Your account'}
              </p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
            <button onClick={signOut} className="text-muted hover:text-danger" aria-label="Sign out">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
