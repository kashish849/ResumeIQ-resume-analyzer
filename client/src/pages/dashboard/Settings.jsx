import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useToast } from '../../components/Toast.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';

function Section({ title, children }) {
  return (
    <div className="card p-6">
      <p className="font-display text-base font-semibold text-text">{title}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { user, signOut, resetPassword, isSupabaseConfigured } = useAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(true);

  const initials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  async function handleChangePassword() {
    if (!isSupabaseConfigured) {
      showToast('Password changes require Supabase to be configured.', 'info');
      return;
    }
    try {
      await resetPassword(user.email);
      showToast('Password reset email sent.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function handleDeleteAccount() {
    showToast('Account deletion is not wired up in this build yet.', 'info');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your profile, appearance, and account.</p>
      </div>

      <Section title="Profile">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-text">{user?.user_metadata?.full_name || 'Your name'}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>
      </Section>

      <Section title="Appearance">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Theme — currently {theme}</p>
          <ThemeToggle />
        </div>
      </Section>

      <Section title="Notifications">
        <label className="flex items-center justify-between">
          <span className="text-sm text-muted">Email notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
        </label>
      </Section>

      <Section title="Privacy">
        <p className="text-sm text-muted">
          {isSupabaseConfigured
            ? 'Your resumes and analysis history are stored under your account in Supabase and are never shared.'
            : 'No Supabase project is configured, so nothing leaves this browser — your resume and history live only in local storage.'}
        </p>
      </Section>

      <Section title="Security">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Change your password</p>
          <button onClick={handleChangePassword} className="btn-secondary px-4 py-2 text-sm">
            Send reset link
          </button>
        </div>
      </Section>

      <Section title="Account">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">Sign out of ResumeIQ</p>
          <button onClick={signOut} className="btn-secondary px-4 py-2 text-sm">Log out</button>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-danger">Delete your account</p>
          <button onClick={handleDeleteAccount} className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10">
            Delete account
          </button>
        </div>
      </Section>
    </div>
  );
}
