import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  updateStatus,
  deleteApplication,
} from "../api/applications";

// Ordered exactly as Kanban columns should appear left → right
export const STATUSES = [
  "wishlist",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
];

// Groups a flat array into { wishlist: [], applied: [], ... }
function groupByStatus(apps) {
  const grouped = Object.fromEntries(STATUSES.map((s) => [s, []]));
  apps.forEach((a) => {
    if (grouped[a.status] !== undefined) grouped[a.status].push(a);
  });
  return grouped;
}

export function useApplications() {
  const [apps, setApps] = useState([]);          // flat list
  const [columns, setColumns] = useState(        // grouped for Kanban
    Object.fromEntries(STATUSES.map((s) => [s, []]))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications(params);
      setApps(data);
      setColumns(groupByStatus(data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ─── Optimistic status update (called by onDragEnd) ──────────────────────
  const moveCard = useCallback(async (appId, newStatus) => {
    // 1. Find the app and remember old status for rollback
    const app = apps.find((a) => a._id === appId);
    if (!app || app.status === newStatus) return;
    const oldStatus = app.status;

    // 2. Optimistically update local state — instant UI response
    setApps((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );
    setColumns((prev) => {
      const next = { ...prev };
      next[oldStatus] = prev[oldStatus].filter((a) => a._id !== appId);
      next[newStatus] = [{ ...app, status: newStatus }, ...prev[newStatus]];
      return next;
    });

    // 3. Persist to backend — rollback on failure
    try {
      await updateStatus(appId, newStatus);
    } catch {
      setApps((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: oldStatus } : a))
      );
      setColumns((prev) => {
        const next = { ...prev };
        next[newStatus] = prev[newStatus].filter((a) => a._id !== appId);
        next[oldStatus] = [{ ...app, status: oldStatus }, ...prev[oldStatus]];
        return next;
      });
    }
  }, [apps]);

  // ─── Add a freshly created app to state without re-fetching ──────────────
  const addApp = useCallback((newApp) => {
    setApps((prev) => [newApp, ...prev]);
    setColumns((prev) => ({
      ...prev,
      [newApp.status]: [newApp, ...prev[newApp.status]],
    }));
  }, []);

  // ─── Remove a deleted app from state ─────────────────────────────────────
  const removeApp = useCallback(async (appId) => {
    const app = apps.find((a) => a._id === appId);
    if (!app) return;
    setApps((prev) => prev.filter((a) => a._id !== appId));
    setColumns((prev) => ({
      ...prev,
      [app.status]: prev[app.status].filter((a) => a._id !== appId),
    }));
    await deleteApplication(appId);
  }, [apps]);

  // ─── Update an app in place after an edit ────────────────────────────────
  const updateApp = useCallback((updated) => {
    setApps((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
    setColumns(groupByStatus(
      apps.map((a) => (a._id === updated._id ? updated : a))
    ));
  }, [apps]);

  return { apps, columns, loading, error, fetchAll, moveCard, addApp, removeApp, updateApp };
}
