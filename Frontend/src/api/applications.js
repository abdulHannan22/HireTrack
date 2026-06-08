import api from "./axios";

// ─── Applications CRUD ────────────────────────────────────────────────────────

export const getApplications = (params = {}) =>
  api.get("/applications", { params }).then((r) => r.data.applications);

export const getApplication = (id) =>
  api.get(`/applications/${id}`).then((r) => r.data);
// returns { application, activity, contact }

export const createApplication = (data) =>
  api.post("/applications", data).then((r) => r.data.application);

export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data).then((r) => r.data.application);

export const updateStatus = (id, status) =>
  api
    .patch(`/applications/${id}/status`, { status })
    .then((r) => r.data.application);

export const deleteApplication = (id) =>
  api.delete(`/applications/${id}`).then((r) => r.data);

// ─── Activity log ─────────────────────────────────────────────────────────────

export const addActivity = (id, type, note) =>
  api
    .post(`/applications/${id}/activity`, { type, note })
    .then((r) => r.data.entry);

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getStats = () =>
  api.get("/applications/meta/stats").then((r) => r.data);
