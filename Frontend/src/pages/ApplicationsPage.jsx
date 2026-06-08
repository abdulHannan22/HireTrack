import { useState, useMemo } from "react";
import { useApplications, STATUSES } from "../hooks/useApplications";
import ApplicationRow from "../components/ApplicationRow";
import AppDetailModal from "../components/modals/AppDetailModal";
import AddApplicationModal from "../components/modals/AddApplicationModal";

// "All" tab + each status
const TABS = ["all", ...STATUSES];

const TAB_LABEL = {
  all:       "All",
  wishlist:  "Wishlist",
  applied:   "Applied",
  screening: "Screening",
  interview: "Interview",
  offer:     "Offer",
  rejected:  "Rejected",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company A–Z" },
  { value: "priority", label: "Priority" },
];

function sortApps(apps, sort) {
  const sorted = [...apps];
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    case "company":
      return sorted.sort((a, b) =>
        a.company.localeCompare(b.company)
      );
    case "priority":
      return sorted.sort((a, b) => a.priority - b.priority);
    default: // newest
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
}

export default function ApplicationsPage() {
  const { apps, loading, error, addApp, removeApp, updateApp } =
    useApplications();

  const [search, setSearch]           = useState("");
  const [activeTab, setActiveTab]     = useState("all");
  const [sort, setSort]               = useState("newest");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // ── Derived list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = apps;

    // Status tab filter
    if (activeTab !== "all") {
      list = list.filter((a) => a.status === activeTab);
    }

    // Search — company or role
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role_title.toLowerCase().includes(q) ||
          (a.location ?? "").toLowerCase().includes(q)
      );
    }

    return sortApps(list, sort);
  }, [apps, activeTab, search, sort]);

  // Count per tab for badges
  const countByStatus = useMemo(() => {
    const counts = { all: apps.length };
    STATUSES.forEach((s) => {
      counts[s] = apps.filter((a) => a.status === s).length;
    });
    return counts;
  }, [apps]);

  // ── Delete flow ──────────────────────────────────────────────────────────
  function handleDeleteRequest(id) {
    setConfirmDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteId) return;
    await removeApp(confirmDeleteId);
    setConfirmDeleteId(null);
    if (selectedApp?._id === confirmDeleteId) setSelectedApp(null);
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {apps.length} total · {filtered.length} shown
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

      {/* Search + sort bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm select-none">
            ⌕
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, role, location…"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-sm"
            >
              ✕
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-emerald-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const count = countByStatus[tab] ?? 0;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/60"
              }`}
            >
              {TAB_LABEL[tab]}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-gray-600 text-gray-200"
                      : "bg-gray-800 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-4 py-3 border-b border-gray-800/60"
              >
                <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-800 rounded animate-pulse w-32" />
                  <div className="h-3 bg-gray-800/60 rounded animate-pulse w-48" />
                </div>
                <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-800/60 rounded animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {search || activeTab !== "all" ? (
              <>
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-gray-400 font-medium mb-1">No results found</p>
                <p className="text-gray-600 text-sm mb-4">
                  Try adjusting your search or filter
                </p>
                <button
                  onClick={() => { setSearch(""); setActiveTab("all"); }}
                  className="text-sm text-emerald-400 hover:underline"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-3xl mb-3">📋</p>
                <p className="text-gray-400 font-medium mb-1">
                  No applications yet
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Start tracking your job hunt
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-sm bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add your first application
                </button>
              </>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                  Company / Role
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Location
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Applied
                </th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Follow-up
                </th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <ApplicationRow
                  key={app._id}
                  app={app}
                  onClick={setSelectedApp}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Result count footer */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-700 text-center mt-4">
          Showing {filtered.length} of {apps.length} applications
        </p>
      )}

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <p className="text-white font-medium mb-1">Delete application?</p>
            <p className="text-gray-500 text-sm mb-5">
              This removes the application and all its activity history.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg py-2 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg py-2 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
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
