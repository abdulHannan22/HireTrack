
import { Draggable } from "@hello-pangea/dnd";

const WORK_MODE_CONFIG = {
  remote: { label: "Remote",  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  hybrid: { label: "Hybrid",  icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" },
  onsite: { label: "On-site", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
};

const PRIORITY_CONFIG = {
  1: { label: "High",   dot: "bg-rose-500",   ring: "ring-rose-500/30",  text: "text-rose-400"  },
  2: { label: "Med",    dot: "bg-amber-400",  ring: "ring-amber-400/30", text: "text-amber-400" },
  3: { label: "Low",    dot: "bg-slate-500",  ring: "ring-slate-500/30", text: "text-slate-400" },
};

function daysAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function JobCard({ app, index, onClick }) {
  const followUpOverdue = isOverdue(app.follow_up_date);
  const appliedLabel    = daysAgo(app.applied_at || app.createdAt);
  const mode            = WORK_MODE_CONFIG[app.work_mode] ?? WORK_MODE_CONFIG.remote;
  const pri             = PRIORITY_CONFIG[app.priority]   ?? PRIORITY_CONFIG[2];

  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(app)}
          className={`
            relative group cursor-pointer select-none
            rounded-xl border transition-all duration-200
            ${snapshot.isDragging
              ? "border-emerald-500/70 shadow-2xl shadow-emerald-500/10 scale-[1.02] rotate-1 bg-gray-800/95"
              : "border-white/[0.07] bg-gray-900/80 hover:border-white/[0.14] hover:bg-gray-900"
            }
            ${followUpOverdue ? "border-l-[3px] border-l-amber-500" : ""}
          `}
        >
          {/* Subtle top-glow when overdue */}
          {followUpOverdue && (
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent rounded-t-xl" />
          )}

          <div className="p-4">
            {/* Row 1: company + priority pill */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                {/* Company initial avatar */}
                <div className="w-6 h-6 rounded-md bg-gray-800 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-gray-400 flex-shrink-0 uppercase">
                  {app.company?.slice(0, 1) ?? "?"}
                </div>
                <span className="text-[11px] font-medium text-gray-500 truncate">
                  {app.company}
                </span>
              </div>

              {/* Priority indicator */}
              <span className={`flex items-center gap-1 text-[10px] font-semibold ${pri.text} flex-shrink-0`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pri.dot}`} />
                {pri.label}
              </span>
            </div>

            {/* Row 2: Role title */}
            <p className="text-[13.5px] font-semibold text-white leading-snug mb-3 line-clamp-2">
              {app.role_title}
            </p>

            {/* Row 3: Work mode + follow-up / date */}
            <div className="flex items-center justify-between gap-2">
              {app.work_mode && (
                <span className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-800/80 border border-white/[0.06] rounded-md px-2 py-0.5">
                  <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={mode.icon} />
                  </svg>
                  {mode.label}
                </span>
              )}

              <span className={`text-[11px] font-medium ml-auto flex items-center gap-1 ${
                followUpOverdue ? "text-amber-400" : "text-gray-600"
              }`}>
                {followUpOverdue && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}
                {followUpOverdue ? "Follow up!" : appliedLabel}
              </span>
            </div>
          </div>

          {/* Hover arrow — appears on hover */}
          <div className="absolute top-4 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </Draggable>
  );
}