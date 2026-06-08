// Skeleton shimmer for a single card
function CardSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-gray-800 rounded mb-3" />
      <div className="h-8 w-14 bg-gray-700 rounded mb-2" />
      <div className="h-3 w-28 bg-gray-800 rounded" />
    </div>
  );
}

const CARDS = [
  {
    key: "total",
    label: "Total tracked",
    icon: "📋",
    color: "text-white",
    sub: (v) => `across all stages`,
  },
  {
    key: "activeInterviews",
    label: "Active interviews",
    icon: "🎯",
    color: "text-emerald-400",
    sub: (v) => v === 1 ? "1 in progress" : `${v} in progress`,
  },
  {
    key: "responseRate",
    label: "Response rate",
    icon: "📈",
    color: "text-blue-400",
    format: (v) => `${v}%`,
    sub: (v) => v >= 30 ? "Above average 🔥" : v >= 15 ? "Keep applying" : "Cast a wider net",
  },
  {
    key: "avgDaysToResponse",
    label: "Avg. days to response",
    icon: "⏱",
    color: "text-amber-400",
    format: (v) => v === null ? "—" : `${v}d`,
    sub: (v) => v === null ? "No responses yet" : v <= 7 ? "Fast turnaround" : v <= 14 ? "About 2 weeks" : "Takes time — follow up",
  },
];

export default function StatCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon, color, format, sub }) => {
        const raw = stats?.[key] ?? 0;
        const display = format ? format(raw) : String(raw);
        const subText = sub(raw);
        return (
          <div
            key={key}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <span className="text-lg">{icon}</span>
            </div>
            <p className={`text-3xl font-semibold tracking-tight ${color} mb-1`}>
              {display}
            </p>
            <p className="text-xs text-gray-600">{subText}</p>
          </div>
        );
      })}
    </div>
  );
}
