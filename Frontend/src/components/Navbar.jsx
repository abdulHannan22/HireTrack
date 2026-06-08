import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/board", label: "Board" },
  { to: "/applications", label: "Applications" },
  { to: "/stats", label: "Stats" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <span className="font-semibold text-white tracking-tight">
          Hire<span className="text-emerald-400">Track</span>
        </span>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-400">
              {user.firstname}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-800/50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
