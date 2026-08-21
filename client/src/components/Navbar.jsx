import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const dashboardLink = () => {
    if (!user) return "/";
    if (user.role === "founder") return "/founder";
    if (user.role === "investor") return "/investor";
    if (user.role === "admin") return "/admin";
    if (user.role === "citizen") return "/citizen";
    if (user.role === "ecosystem_builder") return "/builder";
    return "/";
  };

  const navLink = (to, label) => {
    const active =
      location.pathname === to || location.pathname.startsWith(to + "/");
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? "bg-teal-50 text-teal-800"
            : "text-slate-600 hover:text-teal-800 hover:bg-slate-50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">MinT</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">
                Digital Startup Portal
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                Ministry of Innovation & Technology
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLink("/", "Home")}
            {navLink("/directory", "Designated Startups")}
            {isAuthenticated && navLink("/opportunities", "Opportunities")}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={dashboardLink()} className="text-right hover:opacity-80">
                  <div className="text-sm font-medium text-slate-900">{user.fullName}</div>
                  <div className="text-xs text-slate-500 capitalize">
                    {user.role?.replace("_", " ")} · Workspace
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-teal-800"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl"
                >
                  Apply
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1">
          {navLink("/", "Home")}
          {navLink("/directory", "Designated Startups")}
          {isAuthenticated && navLink("/opportunities", "Opportunities")}
          {isAuthenticated && (
            <>
              <Link
                to={dashboardLink()}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <LayoutDashboard size={16} /> Workspace
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700"
              >
                <User size={16} /> Profile
              </Link>
            </>
          )}
          <div className="pt-3 border-t border-slate-100 mt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 w-full"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded-xl text-center"
                >
                  Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}