interface StatusBadgeProps {
  statusCode: number;
  retryCount?: number;
}

export function StatusBadge({ statusCode, retryCount = 0 }: StatusBadgeProps) {
  const tone =
    retryCount > 0
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : statusCode >= 500
        ? 'border-rose-200 bg-rose-50 text-rose-700'
        : statusCode >= 400
          ? 'border-orange-200 bg-orange-50 text-orange-800'
          : statusCode >= 200 && statusCode < 300
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-slate-200 bg-slate-100 text-slate-700';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}
      aria-label={`${statusCode} HTTP status${retryCount > 0 ? `, ${retryCount} retries` : ''}`}
    >
      {statusCode}
      {retryCount > 0 && <span className="font-medium">· {retryCount} retries</span>}
    </span>
  );
}
