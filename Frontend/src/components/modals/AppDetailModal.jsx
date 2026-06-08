import { useState, useEffect } from "react";
import { getApplication, updateApplication, addActivity } from "../../api/applications";

const ACTIVITY_ICONS = {
  created:              "✦",
  status_changed:       "⇄",
  note_added:           "✎",
  interview_scheduled:  "📅",
  offer_received:       "🎉",
  rejected:             "✕",
  followed_up:          "↑",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AppDetailModal({ app, onClose, onUpdated, onDeleted }) {
  const [detail, setDetail]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [form, setForm] = useState({
    company: "", role_title: "", job_url: "",
    location: "", work_mode: "remote",
    salary_min: "", salary_max: "",
    notes: "", follow_up_date: "",
    priority: 2,
  });

  useEffect(() => {
    if (!app) return;
    setLoading(true);
    getApplication(app._id)
      .then(({ application, activity }) => {
        setDetail({ application, activity });
        setForm({
          company:        application.company        ?? "",
          role_title:     application.role_title     ?? "",
          job_url:        application.job_url        ?? "",
          location:       application.location       ?? "",
          work_mode:      application.work_mode      ?? "remote",
          salary_min:     application.salary_min     ?? "",
          salary_max:     application.salary_max     ?? "",
          notes:          application.notes          ?? "",
          follow_up_date: application.follow_up_date
            ? application.follow_up_date.slice(0, 10)
            : "",
          priority: application.priority ?? 2,
        });
      })
      .finally(() => setLoading(false));
  }, [app]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min === "" ? null : Number(form.salary_min),
        salary_max: form.salary_max === "" ? null : Number(form.salary_max),
        follow_up_date: form.follow_up_date
          ? new Date(form.follow_up_date).toISOString()
          : null,
        priority: Number(form.priority),
      };
      const updated = await updateApplication(app._id, payload);
      setDetail((d) => ({ ...d, application: updated }));
      onUpdated?.(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const entry = await addActivity(app._id, "note_added", noteText.trim());
      setDetail((d) => ({
        ...d,
        activity: [entry, ...d.activity],
      }));
      setNoteText("");
    } finally {
      setAddingNote(false);
    }
  }

  function handleDelete() {
    onDeleted?.(app._id);
    onClose();
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-end"
      onClick={handleBackdrop}
    >
      <div className="h-full w-full max-w-md bg-gray-950 border-l border-gray-800 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 flex-shrink-0">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">
              {detail?.application.company ?? app.company}
            </p>
            <h2 className="text-base font-semibold text-white leading-snug">
              {detail?.application.role_title ?? app.role_title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded hover:bg-gray-800 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white w-7 h-7 flex items-center justify-center rounded hover:bg-gray-800"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="text-gray-600 text-sm">Loading…</span>
            </div>
          ) : (
            <div className="px-5 py-4 space-y-6">

              {/* ── Edit form ── */}
              {editing ? (
                <div className="space-y-3">
                  {[
                    { key: "company",    label: "Company",    type: "text" },
                    { key: "role_title", label: "Role",       type: "text" },
                    { key: "job_url",    label: "Job URL",    type: "url"  },
                    { key: "location",   label: "Location",   type: "text" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 mb-1">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Salary min</label>
                      <input type="number" value={form.salary_min}
                        onChange={(e) => setForm((p) => ({ ...p, salary_min: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        placeholder="₹ / $"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Salary max</label>
                      <input type="number" value={form.salary_max}
                        onChange={(e) => setForm((p) => ({ ...p, salary_max: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        placeholder="₹ / $"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Work mode</label>
                      <select value={form.work_mode}
                        onChange={(e) => setForm((p) => ({ ...p, work_mode: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Priority</label>
                      <select value={form.priority}
                        onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value={1}>High</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Follow-up date</label>
                    <input type="date" value={form.follow_up_date}
                      onChange={(e) => setForm((p) => ({ ...p, follow_up_date: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Notes</label>
                    <textarea value={form.notes} rows={3}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={handleSave} disabled={saving}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2 transition-colors"
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button onClick={() => setEditing(false)}
                      className="flex-1 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg py-2 hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              ) : (
                /* ── Read-only detail view ── */
                <div className="space-y-3">
                  {detail?.application.job_url && (
                    <a
                      href={detail.application.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline break-all"
                    >
                      {detail.application.job_url}
                    </a>
                  )}
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    {[
                      ["Location",  detail?.application.location  || "—"],
                      ["Work mode", detail?.application.work_mode  || "—"],
                      ["Salary",    detail?.application.salary_min
                        ? `${detail.application.salary_min}–${detail.application.salary_max ?? "?"}`
                        : "—"],
                      ["Priority",  ["—","High","Medium","Low"][detail?.application.priority ?? 0]],
                      ["Follow-up", detail?.application.follow_up_date
                        ? new Date(detail.application.follow_up_date).toLocaleDateString()
                        : "—"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-gray-600">{k}</p>
                        <p className="text-gray-300">{v}</p>
                      </div>
                    ))}
                  </div>
                  {detail?.application.notes && (
                    <div className="bg-gray-900 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {detail.application.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Add note ── */}
              {!editing && (
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                    Add note
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                      placeholder="Spoke to recruiter, technical round…"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={addingNote || !noteText.trim()}
                      className="bg-gray-800 hover:bg-gray-700 disabled:opacity-40 border border-gray-700 text-white text-sm rounded-lg px-3 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* ── Activity timeline ── */}
              {!editing && (
                <div>
                  <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">
                    Activity
                  </p>
                  {detail?.activity.length === 0 ? (
                    <p className="text-xs text-gray-700">No activity yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {detail?.activity.map((entry) => (
                        <div key={entry._id} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {ACTIVITY_ICONS[entry.type] ?? "•"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300">{entry.note}</p>
                            <p className="text-[11px] text-gray-600 mt-0.5">
                              {timeAgo(entry.logged_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer — delete */}
        {!editing && (
          <div className="px-5 py-4 border-t border-gray-800 flex-shrink-0">
            {confirmDelete ? (
              <div className="flex gap-2">
                <button onClick={handleDelete}
                  className="flex-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded-lg py-2 transition-colors"
                >
                  Confirm delete
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 border border-gray-700 text-gray-400 hover:text-white text-sm rounded-lg py-2 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg px-3 py-2 transition-colors w-full text-center"
              >
                Delete application
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
