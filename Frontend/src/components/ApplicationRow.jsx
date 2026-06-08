import StatusBadge from "./shared/StatusBadge";
import PriorityDot from "./shared/PriorityDot";

const WORK_MODE_LABEL = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function ApplicationRow({ app, onClick, onDelete }) {
  const followUpOverdue = isOverdue(app.follow_up_date);

  return (
    <tr
      onClick={() => onClick(app)}
      className="border-b border-gray-800/60 hover:bg-gray-800/30 cursor-pointer transition-colors group"
    >
      {/* Company + role */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <PriorityDot priority={app.priority} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-100 truncate">
              {app.company}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {app.role_title}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={app.status} />
      </td>

      {/* Location + mode */}
      <td className="px-4 py-3 hidden md:table-cell">
        <div className="text-xs text-gray-400">
          {app.location || "—"}
          {app.work_mode && (
            <span className="ml-1.5 text-gray-600">
              · {WORK_MODE_LABEL[app.work_mode]}
            </span>
          )}
        </div>
      </td>

      {/* Applied date */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-xs text-gray-500">
          {formatDate(app.applied_at || app.createdAt)}
        </span>
      </td>

      {/* Follow-up */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span
          className={`text-xs ${
            followUpOverdue
              ? "text-amber-400 font-medium"
              : "text-gray-600"
          }`}
        >
          {app.follow_up_date ? formatDate(app.follow_up_date) : "—"}
          {followUpOverdue && " ⚠"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation(); // don't open modal
            onDelete(app._id);
          }}
          className="text-[11px] text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded hover:bg-red-400/10"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
