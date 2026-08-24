import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Sparkles, UserCheck, Shield } from "lucide-react";

function homeForRole(role) {
  if (role === "founder") return "/founder";
  if (role === "investor") return "/investor";
  if (role === "admin") return "/admin/analytics";
  if (role === "reviewer") return "/reviewer";
  if (role === "moderator") return "/moderator";
  if (role === "ecosystem_builder") return "/builder";
  if (role === "citizen") return "/citizen";
  return "/";
}

export default function Login() {
  const [form, setForm] = useState({ email: "founder@mint.gov.et", password: "password123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(homeForRole(user.role));
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (role, email) => {
    switchRole(role);
    navigate(homeForRole(role));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-50">
      {/* Left Sovereign Brand Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center font-bold text-base shadow-lg shadow-teal-950/50">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight block">MinT Digital Hub</span>
              <span className="text-[11px] text-teal-300 font-medium">Proclamation No. 1396/2025</span>
            </div>
          </div>

          <div className="pt-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Identity Gateway</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Official Ethiopian Startup Designation Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              Manage statutory designation filings, digital QR certificates, audited investor data rooms, and national innovation opportunities.
            </p>
          </div>
        </div>

        {/* Quick Demo Workspace Selector */}
        <div className="relative z-10 pt-10 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Role Simulation (1-Click Test)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => quickDemoLogin("founder", "founder@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              🚀 Founder
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin("investor", "investor@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              💼 Investor
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin("admin", "admin@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              🏛️ MinT Admin
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin("reviewer", "reviewer@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              ⚖️ Case Reviewer
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin("ecosystem_builder", "builder@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              🏢 Tech Hub
            </button>
            <button
              type="button"
              onClick={() => quickDemoLogin("citizen", "citizen@mint.gov.et")}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-left border border-white/10 transition-colors"
            >
              🇪🇹 Citizen
            </button>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              New applicant?{" "}
              <Link to="/register" className="text-teal-800 font-bold hover:underline">
                Create new statutory account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="founder@venture.et"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-xl font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-xs rounded-2xl shadow-md shadow-teal-700/20 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Credentials…
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Workspace</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Sovereign encryption backed by Ministry of Innovation & Technology
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
