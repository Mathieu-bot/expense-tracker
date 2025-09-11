
type Props = { password: string };

function scorePassword(pw: string) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 6) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 5);
}

const labelAndColor = (score: number): { label: string; color: string; bar: string } => {
  switch (score) {
    case 0:
    case 1:
      return { label: 'Very weak', color: 'text-red-600', bar: 'bg-red-400' };
    case 2:
      return { label: 'Weak', color: 'text-orange-600', bar: 'bg-orange-400' };
    case 3:
      return { label: 'Fair', color: 'text-yellow-600', bar: 'bg-yellow-400' };
    case 4:
      return { label: 'Good', color: 'text-green-600', bar: 'bg-green-400' };
    case 5:
    default:
      return { label: 'Strong', color: 'text-emerald-600', bar: 'bg-emerald-500' };
  }
}

export default function PasswordStrength({ password }: Props) {
  const score = scorePassword(password);
  const { label, color, bar } = labelAndColor(score);
  const segments = 5;

  const requirements: Array<{ ok: boolean; text: string }> = [
    { ok: password.length >= 6, text: 'At least 6 characters' },
    { ok: /[A-Z]/.test(password), text: 'At least one uppercase letter (A–Z)' },
    { ok: /[0-9]/.test(password), text: 'At least one number (0–9)' },
  ];

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={segments} aria-valuenow={score}>
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-full rounded ${i < score ? bar : 'bg-gray-200'}`}
            aria-hidden
          />
        ))}
      </div>
      <div className={`text-xs ${color}`}>{label}</div>

      <ul className="mt-1 space-y-0.5 text-xs text-gray-600 dark:text-gray-300" aria-label="Password requirements">
        {requirements.map((r, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span
              className={`inline-block h-2 w-2 rounded-full ${r.ok ? 'bg-emerald-500' : 'bg-gray-300'}`}
              aria-hidden
            />
            <span className={r.ok ? 'text-emerald-600 dark:text-emerald-400' : ''}>{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
