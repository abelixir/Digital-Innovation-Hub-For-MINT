import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Lock, ArrowRight, Loader2, ShieldCheck, Shield } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "founder",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName || !form.email || !form.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        form.fullName,
        form.email,
        form.password,
        form.role
      );

      if (user.role === "founder") navigate("/founder");
      else if (user.role === "investor") navigate("/investor");
      else if (user.role === "ecosystem_builder") navigate("/builder");
      else if (user.role === "admin") navigate("/admin/analytics");
      else navigate("/citizen");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "founder",
      label: "Startup Founder",
      desc: "Apply for designation & incentives",
      icon: "🚀",
    },
    {
      value: "investor",
      label: "Accredited Investor",
      desc: "Access verified data rooms",
      icon: "💼",
    },
    {
      value: "ecosystem_builder",
      label: "Ecosystem Builder",
      desc: "Incubator / accelerator hub",
      icon: "🏢",
    },
    {
      value: "citizen",
      label: "Public Observer",
      desc: "Browse sovereign tech directory",
      icon: "🇪🇹",
    },
  ];

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
              <span>National Innovation Onboarding</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
              Join Ethiopia&apos;s Sovereign Startup Ecosystem
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg font-normal">
              Register your enterprise to apply for official designation under Proclamation No. 1396/2025, unlock statutory benefits, and connect with global investors.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-slate-800 text-xs text-slate-400">
          Federal Democratic Republic of Ethiopia · Digital Ethiopia 2030 Strategy
        </div>
      </div>

      {/* Right Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Statutory Account
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Already registered?{" "}
              <Link to="/login" className="text-teal-800 font-bold hover:underline">
                Sign in to existing account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 text-left rounded-2xl border transition-all ${
                      form.role === r.value
                        ? "bg-teal-50 border-teal-500 shadow-2xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span>{r.icon}</span>
                      <span
                        className={`text-xs font-bold ${
                          form.role === r.value ? "text-teal-800" : "text-slate-800"
                        }`}
                      >
                        {r.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Legal Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Abebe Bikila"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

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
                  placeholder="founder@company.et"
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
                  placeholder="Minimum 6 characters"
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
                  <Loader2 size={16} className="animate-spin" /> Provisioning Account…
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
