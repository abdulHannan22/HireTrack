import { Draggable } from "@hello-pangea/dnd";
import PriorityDot from "../shared/PriorityDot";

const WORK_MODE_LABEL = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

function daysAgo(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
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
  const appliedLabel = daysAgo(app.applied_at || app.createdAt);

  return (
    <Draggable draggableId={app._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(app)}
          className={`
            group bg-gray-900 border rounded-lg p-3 mb-2 cursor-pointer
            transition-all duration-150 select-none
            ${snapshot.isDragging
              ? "border-emerald-500 shadow-lg shadow-emerald-500/10 rotate-1 scale-[1.02]"
              : "border-gray-700/60 hover:border-gray-600"
            }
            ${followUpOverdue ? "border-l-2 border-l-amber-500" : ""}
          `}
        >
          {/* Top row — priority dot + company */}
          <div className="flex items-center gap-2 mb-1">
            <PriorityDot priority={app.priority} />
            <span className="text-[11px] text-gray-500 truncate">
              {app.company}
            </span>
          </div>

          {/* Role title */}
          <p className="text-sm font-medium text-gray-100 leading-snug mb-2.5 line-clamp-2">
            {app.role_title}
          </p>

          {/* Bottom row — work mode + days */}
          <div className="flex items-center justify-between gap-2">
            {app.work_mode && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                {WORK_MODE_LABEL[app.work_mode] ?? app.work_mode}
              </span>
            )}
            <span
              className={`text-[11px] ml-auto ${
                followUpOverdue ? "text-amber-400 font-medium" : "text-gray-600"
              }`}
            >
              {followUpOverdue
                ? "Follow up!"
                : appliedLabel}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
