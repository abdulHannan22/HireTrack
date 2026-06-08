import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "../components/kanban/KanbanColumn";
import AppDetailModal from "../components/modals/AppDetailModal";
import AddApplicationModal from "../components/modals/AddApplicationModal";
import { useApplications, STATUSES } from "../hooks/useApplications";

export default function KanbanPage() {
  const { columns, loading, error, moveCard, addApp, removeApp, updateApp } =
    useApplications();

  const [selectedApp, setSelectedApp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // ─── Drag end handler ────────────────────────────────────────────────────
  function onDragEnd(result) {
    const { draggableId, destination } = result;
    if (!destination) return;                          // dropped outside
    if (destination.droppableId === result.source.droppableId) return; // same column

    moveCard(draggableId, destination.droppableId);
  }

  const totalApps = STATUSES.reduce((n, s) => n + (columns[s]?.length ?? 0), 0);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalApps} application{totalApps !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Add application
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((s) => (
            <div key={s} className="w-[220px] flex-shrink-0">
              <div className="h-5 bg-gray-800 rounded mb-3 w-24 animate-pulse" />
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-gray-900 rounded-lg mb-2 animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        /* ── Kanban board ── */
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6 min-h-[60vh]">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                cards={columns[status] ?? []}
                onCardClick={setSelectedApp}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Detail slide-over */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={(updated) => {
            updateApp(updated);
            setSelectedApp(null);
          }}
          onDeleted={(id) => {
            removeApp(id);
            setSelectedApp(null);
          }}
        />
      )}

      {/* Add modal */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newApp) => {
            addApp(newApp);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
