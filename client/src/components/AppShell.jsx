import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Inbox,
  Award,
  Building2,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  ClipboardList,
  Megaphone,
} from "lucide-react";

const NAV = {
  admin: [
    { to: "/admin", label: "Designation Queue", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/admin/builders", label: "Builders", icon: Building2 },
    { to: "/profile", label: "Profile", icon: User },
  ],
  reviewer: [
    { to: "/reviewer", label: "Review queue", icon: ClipboardList, end: true },
    { to: "/reviewer/opportunities", label: "Opportunities", icon: Megaphone },
    { to: "/profile", label: "Profile", icon: User },
  ],
  moderator: [
    { to: "/moderator", label: "Manage posts", icon: Megaphone, end: true },
    { to: "/moderator/browse", label: "Public feed", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
  ],
  founder: [
    { to: "/founder", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/founder/create", label: "Application", icon: FileText },
    { to: "/founder/data-room", label: "Data Room", icon: Inbox },
    { to: "/founder/certificate", label: "Certificate", icon: Award },
    { to: "/founder/opportunities", label: "Opportunities", icon: Megaphone },
    { to: "/profile", label: "Profile", icon: User },
  ],
  investor: [
    { to: "/investor", label: "Discover", icon: LayoutDashboard, end: true },
    { to: "/investor/directory", label: "Startups", icon: Building2 },
    { to: "/investor/builders", label: "Builders", icon: Shield },
    { to: "/investor/opportunities", label: "Post jobs", icon: Briefcase },
    { to: "/investor/browse-opportunities", label: "Opportunities", icon: Megaphone },
    { to: "/profile", label: "Profile", icon: User },
  ],
  citizen: [
    { to: "/citizen", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/citizen/directory", label: "Startups", icon: Building2 },
    { to: "/citizen/builders", label: "Builders", icon: Shield },
    { to: "/citizen/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
  ],
  ecosystem_builder: [
    { to: "/builder", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/builder/apply", label: "Application", icon: FileText },
    { to: "/builder/opportunities", label: "Opportunities", icon: Megaphone },
    { to: "/profile", label: "Profile", icon: User },
  ],
};

const ROLE_LABEL = {
  admin: "MinT Admin",
  reviewer: "Staff Reviewer",
  moderator: "Opportunities Officer",
  founder: "Founder",
  investor: "Investor",
  citizen: "Citizen",
  ecosystem_builder: "Ecosystem Builder",
};

export default function AppShell({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = user?.role || "citizen";
  const links = NAV[role] || NAV.citizen;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItems = ({ onNavigate }) => (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-5 border-b border-slate-100">
          <Link to={links[0]?.to || "/"} className="block">
            <div className="text-sm font-bold text-teal-800 tracking-tight">
              MinT Digital Portal
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {ROLE_LABEL[role] || role}
            </div>
          </Link>
        </div>

        <NavItems />

        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 truncate">{subtitle}</p>
              )}
            </div>

            {actions && (
              <div className="shrink-0 flex items-center gap-2">{actions}</div>
            )}
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-teal-800">MinT Portal</div>
                <div className="text-xs text-slate-500">
                  {ROLE_LABEL[role] || role}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>
            <NavItems onNavigate={() => setOpen(false)} />
            <div className="border-t border-slate-100 p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}