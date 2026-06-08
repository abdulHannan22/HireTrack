import { useState, useEffect } from "react";
import api from "../../api/axios";

const TYPE_CONFIG = {
  created:             { icon: "✦", color: "bg-gray-700 text-gray-400",    label: "Added" },
  status_changed:      { icon: "⇄", color: "bg-blue-900/60 text-blue-400", label: "Moved" },
  note_added:          { icon: "✎", color: "bg-gray-800 text-gray-400",    label: "Note" },
  interview_scheduled: { icon: "📅", color: "bg-emerald-900/60 text-emerald-400", label: "Interview" },
  offer_received:      { icon: "🎉", color: "bg-purple-900/60 text-purple-400",   label: "Offer" },
  rejected:            { icon: "✕", color: "bg-red-900/50 text-red-400",    label: "Rejected" },
  followed_up:         { icon: "↑", color: "bg-amber-900/60 text-amber-400", label: "Follow-up" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function SkeletonTimeline() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-28 bg-gray-800 rounded mb-5" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3 mb-4">
          <div className="w-7 h-7 rounded-full bg-gray-800 flex-shrink-0" />
          <div className="flex-1 space-y-1.5 pt-0.5">
            <div className="h-3 bg-gray-800 rounded w-3/4" />
            <div className="h-2.5 bg-gray-800/60 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ApplicationTimeline() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all applications, then collect recent activity across them
    // We use the flat apps list + their IDs to query activity
    async function load() {
      try {
        const { data } = await api.get("/applications");
        const apps = data.applications ?? [];

        if (apps.length === 0) {
          setEntries([]);
          setLoading(false);
          return;
        }

        // Fetch detail (incl. activity) for up to 10 most recent apps
        const recent = apps.slice(0, 10);
        const details = await Promise.all(
          recent.map((a) =>
            api
              .get(`/applications/${a._id}`)
              .then((r) => ({
                activity: r.data.activity ?? [],
                company: a.company,
                role: a.role_title,
              }))
              .catch(() => ({ activity: [], company: a.company, role: a.role_title }))
          )
        );

        // Flatten, attach company/role, sort newest first, take top 12
        const all = details.flatMap(({ activity, company, role }) =>
          activity.map((e) => ({ ...e, company, role }))
        );
        all.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
        setEntries(all.slice(0, 12));
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <SkeletonTimeline />;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <p className="text-sm font-medium text-gray-200 mb-5">Recent activity</p>

      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 text-sm">No activity yet</p>
          <p className="text-gray-800 text-xs mt-1">
            Activity appears as you add and update applications
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gray-800" />

          <div className="space-y-4">
            {entries.map((entry, i) => {
              const cfg = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.note_added;
              return (
                <div key={entry._id ?? i} className="flex gap-3 relative">
                  {/* Icon bubble */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] flex-shrink-0 z-10 border border-gray-800 ${cfg.color}`}
                  >
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-gray-300 leading-snug">{entry.note}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-gray-600 truncate">
                        {entry.company} · {entry.role}
                      </span>
                      <span className="text-[11px] text-gray-700 flex-shrink-0">
                        {timeAgo(entry.logged_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
