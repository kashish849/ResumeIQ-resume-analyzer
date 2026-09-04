import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ForgotPassword() {
  const { resetPassword, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Enter the email on your account.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send a reset link right now.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        isSupabaseConfigured
          ? "We'll email you a link to reset your password."
          : 'Password reset requires Supabase to be configured.'
      }
      footer={
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 size={36} className="text-success" />
          <p className="text-sm text-muted">Check your inbox for a reset link.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {error && <p role="alert" className="text-sm text-danger">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
