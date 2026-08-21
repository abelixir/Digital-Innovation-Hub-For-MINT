import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Directory from "./pages/directory/Directory";
import StartupDetail from "./pages/directory/StartupDetail";
import FounderDashboard from "./pages/founder/FounderDashboard";
import InvestorDashboard from "./pages/investor/InvestorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCaseDetail from "./pages/admin/AdminCaseDetail";
import CreateStartup from "./pages/founder/CreateStartup";
import DataRoom from "./pages/founder/DataRoom";
import FounderCertificate from "./pages/founder/FounderCertificate";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/admin/AdminUsers";
import Opportunities from "./pages/Opportunities";
import AdminOpportunities from "./pages/admin/AdminOpportunities";
import InvestorOpportunities from "./pages/investor/InvestorOpportunities";

function roleHome(role) {
  if (role === "founder") return "/founder";
  if (role === "investor") return "/investor";
  if (role === "admin") return "/admin";
  if (role === "citizen") return "/citizen";
  if (role === "ecosystem_builder") return "/builder";
  return "/";
}

function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={roleHome(user.role)} replace />;
  }

  return children;
}

/** Public marketing chrome (top nav + footer) */
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ——— Public only ——— */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <PublicLayout><Login /></PublicLayout>
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <PublicLayout><Register /></PublicLayout>
          </PublicOnlyRoute>
        }
      />

      {/* Public directory (guests) — top nav */}
      <Route path="/directory" element={<PublicLayout><Directory /></PublicLayout>} />
      <Route path="/directory/:id" element={<PublicLayout><StartupDetail /></PublicLayout>} />

      {/* ——— Founder console (sidebar only, NO top nav) ——— */}
      <Route
        path="/founder"
        element={
          <ProtectedRoute roles={["founder"]}>
            <FounderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/founder/create"
        element={
          <ProtectedRoute roles={["founder"]}>
            <CreateStartup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/founder/data-room"
        element={
          <ProtectedRoute roles={["founder"]}>
            <DataRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/founder/certificate"
        element={
          <ProtectedRoute roles={["founder"]}>
            <FounderCertificate />
          </ProtectedRoute>
        }
      />

      {/* ——— Investor console ——— */}
      <Route
        path="/investor"
        element={
          <ProtectedRoute roles={["investor"]}>
            <InvestorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/directory"
        element={
          <ProtectedRoute roles={["investor"]}>
            <Directory embedded />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/directory/:id"
        element={
          <ProtectedRoute roles={["investor"]}>
            <StartupDetail embedded />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/opportunities"
        element={
          <ProtectedRoute roles={["investor"]}>
            <InvestorOpportunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/browse-opportunities"
        element={
          <ProtectedRoute roles={["investor"]}>
            <Opportunities embedded />
          </ProtectedRoute>
        }
      />

      {/* ——— Citizen console ——— */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute roles={["citizen"]}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/directory"
        element={
          <ProtectedRoute roles={["citizen"]}>
            <Directory embedded />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/directory/:id"
        element={
          <ProtectedRoute roles={["citizen"]}>
            <StartupDetail embedded />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/opportunities"
        element={
          <ProtectedRoute roles={["citizen"]}>
            <Opportunities embedded />
          </ProtectedRoute>
        }
      />

      {/* ——— Admin console ——— */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/cases/:id"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminCaseDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/opportunities"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminOpportunities />
          </ProtectedRoute>
        }
      />

      {/* Shared profile inside console shell */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Legacy /opportunities → send role to their own path */}
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <OpportunitiesRedirect />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function OpportunitiesRedirect() {
  const { user } = useAuth();
  if (user?.role === "citizen") return <Navigate to="/citizen/opportunities" replace />;
  if (user?.role === "investor") return <Navigate to="/investor/browse-opportunities" replace />;
  if (user?.role === "admin") return <Navigate to="/admin/opportunities" replace />;
  if (user?.role === "founder") return <Navigate to="/founder" replace />;
  return <Opportunities />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}