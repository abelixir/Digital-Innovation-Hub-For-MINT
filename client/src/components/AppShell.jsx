import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Briefcase,
  LogOut,
  User,
  Shield,
  Inbox,
  Award,
  Menu,
  X,
  ClipboardList,
  Megaphone,
  Network,
  BarChart3,
  Search,
  Bell,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useState } from "react";

const NAV = {
  admin: [
    { to: "/admin/analytics", label: "Analytics & Oversight", icon: BarChart3, end: true },
    { to: "/admin", label: "Designation Cases", icon: Building2 },
    { to: "/admin/builders", label: "Ecosystem Hubs", icon: Network },
    { to: "/admin/users", label: "User Access Control", icon: Users },
    { to: "/admin/opportunities", label: "National Opportunities", icon: Briefcase },
  ],
  reviewer: [
    { to: "/reviewer", label: "Startup Reviews", icon: ClipboardList, end: true },
    { to: "/reviewer/builders", label: "Builder Audits", icon: Building2 },
    { to: "/reviewer/opportunities", label: "Opportunities", icon: Megaphone },
  ],
  moderator: [
    { to: "/moderator", label: "Opportunity Posts", icon: Megaphone, end: true },
    { to: "/moderator/startups", label: "Startup Registry", icon: Building2 },
    { to: "/moderator/builders", label: "Builders Hub", icon: Network },
    { to: "/moderator/browse", label: "Public Feed", icon: Briefcase },
  ],
  founder: [
    { to: "/founder", label: "Venture Overview", icon: LayoutDashboard, end: true },
    { to: "/founder/create", label: "Statutory Filing", icon: FileText },
    { to: "/founder/data-room", label: "Secure Data Room", icon: Inbox },
    { to: "/founder/certificate", label: "Designation Certificate", icon: Award },
    { to: "/founder/opportunities", label: "Funding & Programs", icon: Megaphone },
  ],
  investor: [
    { to: "/investor", label: "Deal Pipeline", icon: LayoutDashboard, end: true },
    { to: "/investor/directory", label: "Designated Startups", icon: Building2 },
    { to: "/investor/opportunities", label: "Post Mandates", icon: Briefcase },
    { to: "/investor/browse-opportunities", label: "All Opportunities", icon: Shield },
  ],
  citizen: [
    { to: "/citizen", label: "Innovation Hub", icon: LayoutDashboard, end: true },
    { to: "/citizen/directory", label: "Verified Startups", icon: Building2 },
    { to: "/citizen/builders", label: "Ecosystem Builders", icon: Network },
    { to: "/citizen/opportunities", label: "Public Calls", icon: Briefcase },
  ],
  ecosystem_builder: [
    { to: "/builder", label: "Hub Overview", icon: LayoutDashboard, end: true },
    { to: "/builder/apply", label: "Accreditation Filing", icon: FileText },
    { to: "/builder/opportunities", label: "Host Programs", icon: Megaphone },
  ],
};

const ROLES_LIST = [
  { id: "founder", label: "Founder", color: "bg-teal-500/10 text-teal-700 border-teal-200" },
  { id: "investor", label: "Investor", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  { id: "admin", label: "MinT Admin", color: "bg-indigo-500/10 text-indigo-700 border-indigo-200" },
  { id: "reviewer", label: "Reviewer", color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  { id: "ecosystem_builder", label: "Builder Hub", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  { id: "citizen", label: "Public Citizen", color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
];

export default function AppShell({ title, subtitle, children, actions }) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const currentRole = user?.role || "founder";
  const items = NAV[currentRole] || NAV.founder;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRoleChange = (newRole) => {
    if (switchRole) {
      switchRole(newRole);
    } else {
      // Local demo fallback
      const updatedUser = { ...(user || { fullName: "Abebe Bikila", email: "user@mint.gov.et" }), role: newRole };
      localStorage.setItem("dih_user", JSON.stringify(updatedUser));
      window.location.reload();
    }
    setShowRoleSwitcher(false);
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? "bg-teal-600 text-white shadow-md shadow-teal-700/20 font-bold"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-200/80 bg-slate-50/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
            MinT
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-extrabold text-slate-900 tracking-tight leading-none">
              Federal Democratic Republic
            </div>
            <div className="text-[11px] font-bold text-teal-800 tracking-tight leading-none mt-1">
              Ministry of Innovation & Tech
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
              Proclamation No. 1396/2025
            </div>
          </div>
        </Link>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-5 py-3 bg-slate-100/60 border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Workspace
          </span>
        </div>

        <button
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          className="text-[10px] font-bold text-teal-800 hover:underline flex items-center gap-0.5 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200"
          title="Switch workspace role"
        >
          <span className="capitalize">{currentRole.replace("_", " ")}</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Quick Role Switcher Dropdown */}
      {showRoleSwitcher && (
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-1 text-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 px-1">
            Switch Portal Perspective:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {ROLES_LIST.map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`px-2 py-1.5 rounded-lg text-left font-semibold text-[11px] border transition-all ${
                  currentRole === r.id
                    ? "bg-teal-600 text-white border-teal-600 font-bold"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
          Main Navigation
        </div>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-200/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
            Public Registry
          </div>
          <NavLink
            to="/directory"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => setOpen(false)}
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Designated Directory</span>
          </NavLink>
          <NavLink
            to="/builders"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => setOpen(false)}
          >
            <Network className="w-4 h-4 text-slate-400" />
            <span>Ecosystem Builders</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Account Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* User Footer Summary */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-white border border-slate-200/70">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user?.fullName || "Abebe Bikila"}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {user?.email || "user@mint.gov.et"}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign out of Portal</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Left-Side Nav Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 shadow-xs">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            {/* Mobile Menu Trigger & Title */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600"
                onClick={() => setOpen(true)}
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate tracking-tight">
                    {title}
                  </h1>
                </div>
                {subtitle && (
                  <p className="text-xs text-slate-500 truncate hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions & Global Shortcuts */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Public Portal</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
