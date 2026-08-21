import { NavLink, Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useState } from "react";

const NAV = {
  admin: [
    { to: "/admin", label: "Designation Queue", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
  ],
  founder: [
    { to: "/founder", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/founder/create", label: "Application", icon: FileText },
    { to: "/founder/data-room", label: "Data Room", icon: Inbox },
    { to: "/founder/certificate", label: "Certificate", icon: Award },
  ],
  investor: [
    { to: "/investor", label: "Discover", icon: LayoutDashboard, end: true },
    { to: "/investor/directory", label: "Directory", icon: Building2 },
    { to: "/investor/opportunities", label: "Post jobs", icon: Briefcase },
    { to: "/investor/browse-opportunities", label: "All opportunities", icon: Shield },
  ],
  citizen: [
    { to: "/citizen", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/citizen/directory", label: "Directory", icon: Building2 },
    { to: "/citizen/opportunities", label: "Opportunities", icon: Briefcase },
  ],
  ecosystem_builder: [
    { to: "/builder", label: "Overview", icon: LayoutDashboard, end: true },
  ],
};

export default function AppShell({ title, subtitle, children, actions }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = NAV[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? "bg-teal-50 text-teal-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
            MinT
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Digital Portal</div>
            <div className="text-[11px] text-slate-500 capitalize">{user?.role?.replace("_", " ")}</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
          <User size={18} />
          Profile
        </NavLink>
      </nav>

      <div className="px-3 py-4 border-t border-slate-200">
        <div className="px-3 mb-3">
          <div className="text-sm font-medium text-slate-900 truncate">{user?.fullName}</div>
          <div className="text-xs text-slate-500 truncate">{user?.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:pl-64 min-w-0">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                onClick={() => setOpen(true)}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-slate-500 truncate">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}