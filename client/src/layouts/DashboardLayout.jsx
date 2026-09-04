import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-5 py-4 md:hidden">
          <button onClick={() => setOpen(true)} className="text-text" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-display font-bold text-text">ResumeIQ</span>
          <ThemeToggle />
        </header>

        <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
