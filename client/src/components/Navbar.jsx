import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Building2,
  Network,
  Briefcase,
} from "lucide-react";
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
    if (user.role === "admin") return "/admin/analytics";
    if (user.role === "reviewer") return "/reviewer";
    if (user.role === "moderator") return "/moderator";
    if (user.role === "citizen") return "/citizen";
    if (user.role === "ecosystem_builder") return "/builder";
    return "/";
  };

  const navLink = (to, label, icon = null) => {
    const active =
      location.pathname === to || (to !== "/" && location.pathname.startsWith(to + "/"));
    const Icon = icon;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
          active
            ? "bg-teal-50 text-teal-800 font-extrabold shadow-2xs"
            : "text-slate-600 hover:text-teal-900 hover:bg-slate-100/80"
        }`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 opacity-70" />}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* MinT Sovereign Seal & Portal Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 flex items-center justify-center shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform text-white">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  MinT Digital Hub
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 font-mono text-[9px] font-bold border border-amber-500/20">
                  No. 1396/2025
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Federal Democratic Republic of Ethiopia
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 p-1.5 rounded-2xl border border-slate-200/60">
            {navLink("/", "Portal Home")}
            {navLink("/directory", "Designated Startups", Building2)}
            {navLink("/builders", "Ecosystem Hubs", Network)}
            {isAuthenticated && navLink("/opportunities", "National Calls", Briefcase)}
          </nav>

          {/* User & Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={dashboardLink()}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                      {user?.fullName || "Abebe Bikila"}
                    </div>
                    <div className="text-[10px] text-teal-700 capitalize font-semibold">
                      {user?.role?.replace("_", " ")} Workspace
                    </div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-teal-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-700/20 hover:scale-[1.02] transition-all flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Apply for Designation</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-xl">
          {navLink("/", "Portal Home")}
          {navLink("/directory", "Designated Startups", Building2)}
          {navLink("/builders", "Ecosystem Builders", Network)}
          {isAuthenticated && navLink("/opportunities", "National Calls", Briefcase)}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to={dashboardLink()}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-teal-800 bg-teal-50 rounded-xl"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to {user?.role?.replace("_", " ")} Workspace</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-center border border-slate-200 rounded-xl text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-center bg-teal-600 text-white rounded-xl shadow-md shadow-teal-700/20"
              >
                Apply for Designation
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
