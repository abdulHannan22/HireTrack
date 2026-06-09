import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";
import { COLUMN_META } from "../shared/StatusBadge";

export default function KanbanColumn({
  status,
  cards,
  onCardClick,
  totalApps,
}) {
  const meta = COLUMN_META[status];
  const [collapsed, setCollapsed] = useState(false);
  const pct = totalApps > 0 ? Math.round((cards.length / totalApps) * 100) : 0;

  return (
    <div className="w-full">
      {/* ── Section header ────────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full group"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-3 px-1 py-2.5 rounded-xl hover:bg-white/[0.02] transition-colors">
          {/* Accent dot */}
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot} shadow-lg`}
            style={{ boxShadow: `0 0 8px currentColor` }}
          />

          {/* Label */}
          <span
            className={`text-[11px] font-bold uppercase tracking-widest ${meta.header}`}
          >
            {meta.label}
          </span>

          {/* Count badge */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.count}`}
          >
            {cards.length}
          </span>

          {/* Progress bar */}
          <div className="flex-1 h-1 bg-gray-800/80 rounded-full overflow-hidden mx-1">
            
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background:
                  "linear-gradient(to right, rgba(59,130,246,.8), rgba(59,130,246,.4))",
              }}
            />
          </div>

          {/* Percentage */}
          <span className="text-[10px] text-gray-600 tabular-nums w-8 text-right flex-shrink-0">
            {pct}%
          </span>

          {/* Chevron */}
          <svg
            className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
              collapsed ? "-rotate-90" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Header bottom line + gradient fade */}
        <div
          className={`h-px w-full bg-gradient-to-r ${meta.accent} opacity-60`}
        />
      </button>

      {/* ── Droppable zone ────────────────────────────────────────────────── */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`transition-all duration-200 overflow-hidden ${
              collapsed
                ? "max-h-0 opacity-0 pointer-events-none"
                : "max-h-[9999px] opacity-100"
            }`}
          >
            <div
              className={`
                mt-2 mb-1 rounded-xl p-2.5 min-h-[64px] transition-all duration-150
                ${
                  snapshot.isDraggingOver
                    ? `bg-gray-800/60 ring-1 ${meta.ring}`
                    : "bg-transparent"
                }
              `}
            >
              {cards.length === 0 && !snapshot.isDraggingOver && (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <svg
                    className="w-5 h-5 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-[11px] text-gray-700 select-none">
                    Drop here or drag cards in
                  </span>
                </div>
              )}

              {/* ── Responsive card grid ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {cards.map((app, index) => (
                  <JobCard
                    key={app._id}
                    app={app}
                    index={index}
                    onClick={onCardClick}
                  />
                ))}
              </div>

              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>

      {/* Section gap */}
      <div className="h-2" />
    </div>
  );
}
