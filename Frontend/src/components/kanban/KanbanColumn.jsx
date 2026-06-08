import { Droppable } from "@hello-pangea/dnd";
import JobCard from "./JobCard";
import { COLUMN_META } from "../shared/StatusBadge";

export default function KanbanColumn({ status, cards, onCardClick }) {
  const meta = COLUMN_META[status];

  return (
    <div className="flex flex-col w-[220px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${meta.header}`}>
          {meta.label}
        </span>
        <span className="ml-auto text-[11px] text-gray-600 bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded-full">
          {cards.length}
        </span>
      </div>

      {/* Droppable zone */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 min-h-[120px] rounded-xl p-2 transition-colors duration-150
              ${snapshot.isDraggingOver
                ? "bg-gray-800/80 ring-1 ring-emerald-500/30"
                : "bg-gray-900/40"
              }
            `}
          >
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-[11px] text-gray-700 text-center mt-6 select-none">
                Drop here
              </p>
            )}

            {cards.map((app, index) => (
              <JobCard
                key={app._id}
                app={app}
                index={index}
                onClick={onCardClick}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
