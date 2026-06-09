import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "../components/kanban/KanbanColumn";
import AppDetailModal from "../components/modals/AppDetailModal";
import AddApplicationModal from "../components/modals/AddApplicationModal";
import { useApplications, STATUSES } from "../hooks/useApplications";

const STATUS_ICONS = {
  wishlist:  "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  applied:   "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  screening: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  interview: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  offer:     "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  rejected:  "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

const STATUS_COLORS = {
  wishlist:  "text-slate-400",
  applied:   "text-blue-400",
  screening: "text-amber-400",
  interview: "text-emerald-400",
  offer:     "text-violet-400",
  rejected:  "text-rose-400",
};

export default function KanbanPage() {
  const { columns, loading, error, moveCard, addApp, removeApp, updateApp } =
    useApplications();

  const [selectedApp, setSelectedApp]   = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  function onDragEnd(result) {
    const { draggableId, destination } = result;
    if (!destination) return;
    if (destination.droppableId === result.source.droppableId) return;
    moveCard(draggableId, destination.droppableId);
  }

  const totalApps    = STATUSES.reduce((n, s) => n + (columns[s]?.length ?? 0), 0);
  const activeApps   = (columns.applied?.length ?? 0) + (columns.screening?.length ?? 0) + (columns.interview?.length ?? 0);
  const offerCount   = columns.offer?.length ?? 0;
  const successRate  = totalApps > 0
    ? Math.round(((columns.offer?.length ?? 0) / totalApps) * 100)
    : 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a0c10 0%, #080a0d 100%)" }}>
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Application Board
              </h1>
            </div>
            <p className="text-sm text-gray-500 ml-4">
              Track your job search pipeline — drag cards to update status
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-150 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add application
          </button>
        </div>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total tracked",  value: totalApps,   icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-gray-300" },
            { label: "In pipeline",    value: activeApps,  icon: "M13 10V3L4 14h7v7l9-11h-7z",                                                                                                         color: "text-blue-400"  },
            { label: "Offers",         value: offerCount,  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-violet-400" },
            { label: "Success rate",   value: `${successRate}%`, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "text-emerald-400" },
          ].map(({ label, value, icon, color }) => (
            <div
              key={label}
              className="bg-gray-900/60 border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center flex-shrink-0">
                <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-gray-600 mb-0.5 leading-none">{label}</p>
                <p className={`text-xl font-bold leading-none ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Error state ───────────────────────────────────────────────── */}
        {error && (
          <div className="mb-5 flex items-center gap-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Loading skeleton ───────────────────────────────────────────── */}
        {loading ? (
          <div className="space-y-5">
            {STATUSES.map((s) => (
              <div key={s}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-800 animate-pulse" />
                  <div className="h-3 bg-gray-800 rounded w-20 animate-pulse" />
                  <div className="flex-1 h-1 bg-gray-800 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-gray-900/60 rounded-xl border border-white/[0.04] animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Board ──────────────────────────────────────────────────── */
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="space-y-1">
              {STATUSES.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  cards={columns[status] ?? []}
                  onCardClick={setSelectedApp}
                  totalApps={totalApps}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* ── Detail modal ────────────────────────────────────────────────── */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={(updated) => { updateApp(updated); setSelectedApp(null); }}
          onDeleted={(id)      => { removeApp(id);      setSelectedApp(null); }}
        />
      )}

      {/* ── Add modal ───────────────────────────────────────────────────── */}
      {showAddModal && (
        <AddApplicationModal
          onClose={() => setShowAddModal(false)}
          onAdded={(newApp) => { addApp(newApp); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}