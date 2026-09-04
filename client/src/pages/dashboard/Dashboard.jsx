import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Sparkles, FileText, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../../components/dashboard/StatCard.jsx';
import ResumeHealth from '../../components/dashboard/ResumeHealth.jsx';
import RecentAnalyses from '../../components/dashboard/RecentAnalyses.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import { getHistory, deleteHistoryEntry } from '../../lib/history.js';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const firstName = (user?.user_metadata?.full_name || user?.email || 'there').split(' ')[0].split('@')[0];
  const latest = history[0];
  const improvementsCount = history.reduce((sum, h) => sum + (h.analysis?.recommendations?.length || 0), 0);

  function handleView(entry) {
    sessionStorage.setItem(
      'resumeiq-last-analysis',
      JSON.stringify({ fileName: entry.fileName, analysis: entry.analysis, jobMatch: entry.jobMatch })
    );
    navigate('/dashboard/results');
  }

  function handleDelete(id) {
    setHistory(deleteHistoryEntry(id));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Good to see you, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted">Let's make your next application stronger.</p>
        </div>
        <Link to="/dashboard/analyze" className="btn-primary px-5 py-2.5">
          New analysis
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Latest ATS score" value={latest ? latest.score : '—'} icon={TrendingUp} delay={0} />
        <StatCard label="Job match" value={latest?.matchScore != null ? `${latest.matchScore}%` : '—'} icon={Target} delay={0.05} />
        <StatCard label="Resumes analyzed" value={history.length} icon={FileText} delay={0.1} />
        <StatCard label="Improvements" value={improvementsCount} icon={Sparkles} delay={0.15} />
      </div>

      <ResumeHealth score={latest ? latest.score : 0} breakdown={latest?.analysis?.breakdown} />

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-text">Quick actions</p>
        <QuickActions />
      </div>

      <div>
        <p className="mb-3 font-display text-lg font-semibold text-text">Recent analyses</p>
        <RecentAnalyses rows={history.slice(0, 5)} onView={handleView} onDelete={handleDelete} />
      </div>
    </div>
  );
}
