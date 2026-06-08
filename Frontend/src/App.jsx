import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages — create these on Days 3–6

import Login from "./pages/Login";
import Register from "./pages/Register";
import KanbanPage from "./pages/KanbanPage";
// import ApplicationsPage from "./pages/ApplicationsPage";
// import StatsPage from "./pages/StatsPage";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (placeholder) — uncomment when pages exist */}
          {/*
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <Layout><KanbanPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Layout><ApplicationsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Layout><StatsPage /></Layout>
              </ProtectedRoute>
            }
          />
          */}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
