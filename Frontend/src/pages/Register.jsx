import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    clearError();
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form.firstname, form.lastname, form.email, form.password);
      navigate("/board", { replace: true });
    } catch {
      // error set in AuthContext
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white mb-1">
          Hire<span className="text-emerald-400">Track</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {["firstname", "lastname"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-gray-300 mb-1 capitalize">
                  {field === "firstname" ? "First name" : "Last name"}
                </label>
                <input
                  name={field}
                  type="text"
                  value={form[field]}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>
          {["email", "password"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-300 mb-1 capitalize">
                {field}
              </label>
              <input
                name={field}
                type={field === "password" ? "password" : "email"}
                value={form[field]}
                onChange={handleChange}
                required
                minLength={field === "password" ? 6 : undefined}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                placeholder={field === "email" ? "you@example.com" : "Min. 6 characters"}
              />
            </div>
          ))}

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-gray-500 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
