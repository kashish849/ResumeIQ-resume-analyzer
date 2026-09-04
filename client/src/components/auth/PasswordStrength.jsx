function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-primary', 'bg-success'];

export default function PasswordStrength({ password }) {
  if (!password) return null;
  const score = scorePassword(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < score ? COLORS[score] : 'bg-surface-2'
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-muted">{LABELS[score]}</p>
    </div>
  );
}
