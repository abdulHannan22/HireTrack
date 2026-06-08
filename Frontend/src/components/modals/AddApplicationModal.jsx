import { useState } from "react";
import { createApplication } from "../../api/applications";

const DEFAULTS = {
  company: "", role_title: "", job_url: "",
  location: "", work_mode: "remote",
  salary_min: "", salary_max: "",
  status: "wishlist", notes: "",
  follow_up_date: "", priority: 2,
};

export default function AddApplicationModal({ onClose, onAdded }) {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company.trim() || !form.role_title.trim()) {
      setError("Company and role are required.");
      return;
    }
    setSaving(true);
    setError(null);
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
      const newApp = await createApplication(payload);
      onAdded?.(newApp);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create application");
    } finally {
      setSaving(false);
    }
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={handleBackdrop}
    >
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold text-white">Add application</h2>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white w-7 h-7 flex items-center justify-center rounded hover:bg-gray-800"
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Company *</label>
              <input type="text" value={form.company} onChange={set("company")} required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Stripe" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Role title *</label>
              <input type="text" value={form.role_title} onChange={set("role_title")} required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Backend Engineer" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Job URL</label>
              <input type="url" value={form.job_url} onChange={set("job_url")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="https://jobs.stripe.com/..." />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={set("status")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {["wishlist","applied","screening","interview","offer","rejected"].map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Work mode</label>
              <select value={form.work_mode} onChange={set("work_mode")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Location</label>
              <input type="text" value={form.location} onChange={set("location")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="Bangalore / Remote" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              <select value={form.priority} onChange={set("priority")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Salary min</label>
              <input type="number" value={form.salary_min} onChange={set("salary_min")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="₹ / $" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Salary max</label>
              <input type="number" value={form.salary_max} onChange={set("salary_max")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="₹ / $" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Follow-up date</label>
              <input type="date" value={form.follow_up_date} onChange={set("follow_up_date")}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <textarea value={form.notes} onChange={set("notes")} rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Referral from alumni, first-round details…" />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
            >
              {saving ? "Adding…" : "Add application"}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-700 text-gray-300 hover:text-white text-sm rounded-lg py-2.5 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
