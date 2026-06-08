import { useState, useEffect } from "react";
import { getStats } from "../api/applications";
import StatCards from "../components/stats/StatCards";
import StatusBarChart from "../components/stats/StatusBarChart";
import ApplicationTimeline from "../components/stats/ApplicationTimeline";

// Inline pipeline funnel — no extra library needed
function PipelineFunnel({ stats, loading }) {
  const STAGES = [
    { key: "applied",   label: "Applied",   color: "bg-blue-500" },
    { key: "screening", label: "Screening", color: "bg-amber-500" },
    { key: "interview", label: "Interview", color: "bg-emerald-500" },
    { key: "offer",     label: "Offer",     color: "bg-purple-500" },
  ];

  const total = stats?.byStatus?.applied ?? 1; // avoid div/0

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <p className="text-sm font-medium text-gray-200 mb-1">Conversion funnel</p>
      <p className="text-xs text-gray-600 mb-5">
        How applications progress through your pipeline
      </p>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[100, 60, 40, 20].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-16 bg-gray-800 rounded" />
              <div className="flex-1 h-7 bg-gray-800 rounded" style={{ maxWidth: `${w}%` }} />
              <div className="h-3 w-6 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {STAGES.map(({ key, label, color }) => {
            const count = stats?.byStatus?.[key] ?? 0;
            const pct = total > 0 ? Math.max(4, Math.round((count / total) * 100)) : 4;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 flex-shrink-0 text-right">
                  {label}
                </span>
                <div className="flex-1 h-7 bg-gray-800 rounded overflow-hidden">
                  <div
                    className={`h-full ${color} rounded transition-all duration-500 flex items-center px-2`}
                    style={{ width: `${pct}%` }}
                  >
                    {count > 0 && (
                      <span className="text-[10px] text-white/80 font-medium">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-600 w-8 flex-shrink-0">
                  {count > 0 && total > 0
                    ? `${Math.round((count / total) * 100)}%`
                    : "—"}
                </span>
              </div>
            );
          })}
          <p className="text-[11px] text-gray-700 mt-3 pt-3 border-t border-gray-800">
            Based on {stats?.byStatus?.applied ?? 0} applied applications
          </p>
        </div>
      )}
    </div>
  );
}

// Quick tip based on actual stats
function InsightCard({ stats, loading }) {
  if (loading || !stats) return null;

  const { total, responseRate, activeInterviews, byStatus } = stats;

  let insight = null;

  if (total === 0) {
    insight = { emoji: "🚀", text: "Add your first application to start seeing insights." };
  } else if (activeInterviews >= 2) {
    insight = { emoji: "🔥", text: `You have ${activeInterviews} active interviews — great momentum! Prep well and follow up.` };
  } else if (byStatus?.offer > 0) {
    insight = { emoji: "🎉", text: "You have an offer! Make sure to compare it against your wishlist companies." };
  } else if (responseRate < 10 && total >= 5) {
    insight = { emoji: "📝", text: "Response rate is below 10%. Consider tailoring your resume per application or following up after 7 days." };
  } else if (responseRate >= 30) {
    insight = { emoji: "✅", text: `${responseRate}% response rate — well above average. Your applications are landing well.` };
  } else if (byStatus?.wishlist > 5) {
    insight = { emoji: "⏳", text: `You have ${byStatus.wishlist} jobs in your wishlist. Time to apply — don't let them go stale.` };
  } else {
    insight = { emoji: "💪", text: "Keep applying consistently. Aim for 5–8 quality applications per week." };
  }

  return (
    <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 flex gap-3">
      <span className="text-xl flex-shrink-0">{insight.emoji}</span>
      <p className="text-sm text-emerald-200/80 leading-relaxed">{insight.text}</p>
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Stats</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your job search at a glance
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Insight card */}
      {!loading && !error && <InsightCard stats={stats} loading={loading} />}

      {/* Stat cards row */}
      <StatCards stats={stats} loading={loading} />

      {/* Chart + funnel row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusBarChart stats={stats} loading={loading} />
        <PipelineFunnel stats={stats} loading={loading} />
      </div>

      {/* Activity timeline */}
      <ApplicationTimeline />
    </div>
  );
}
