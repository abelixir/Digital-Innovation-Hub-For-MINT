import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BadgeCheck,
  ArrowRight,
  Building2,
  Users,
  Zap,
  Loader2,
  Award,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import StartupCard from "../components/StartupCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [startupsRes, statsRes] = await Promise.all([
          apiRequest("/startups"),
          apiRequest("/startups/public-stats"),
        ]);
        setFeatured((startupsRes.data || []).slice(0, 3));
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-100 text-xs font-medium mb-6">
              <Shield size={13} /> Official MinT Portal · Proclamation 1396/2025
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Ethiopia&apos;s official
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-300">
                Startup Designation Portal
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Apply for MinT designation, receive certificates, manage data rooms,
              and connect founders with investors under a transparent, audited
              government workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-900/40"
              >
                Browse designated startups <ArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20"
              >
                Apply for designation
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Designated startups", value: stats?.verifiedStartups ?? "—" },
              { label: "Active investors", value: stats?.totalInvestors ?? "—" },
              { label: "Total applications", value: stats?.totalStartups ?? "—" },
              { label: "Sectors", value: stats?.sectorsCovered ?? "7" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How the portal works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Designation is the trust anchor — not a simple verify button.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: "Founders",
                desc: "Submit eligibility data, receive MinT review within working-day timelines, get a designation certificate, and control data-room access.",
                color: "bg-teal-50 text-teal-700",
              },
              {
                icon: Users,
                title: "Investors",
                desc: "Browse only designated startups, request data-room access, and track approvals in one workspace.",
                color: "bg-blue-50 text-blue-700",
              },
              {
                icon: Award,
                title: "MinT Admin",
                desc: "Case files, eligibility checks, designate / reject / suspend / revoke, certificates, and full audit trails.",
                color: "bg-amber-50 text-amber-700",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-50 rounded-2xl p-7 border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${item.color}`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-teal-700 text-sm font-semibold mb-4">
                <Zap size={16} /> Core capability
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Designation + secure data room
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Public profiles are open. Pitch decks, financials, and legal files stay
                locked until the founder approves access — with an auditable trail.
              </p>
              <ul className="space-y-3">
                {[
                  "Legal eligibility checklist (ownership, age, innovation)",
                  "30 working-day review timeline",
                  "Official certificate with expiry & renewal",
                  "Founder-controlled data room access",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <BadgeCheck size={18} className="text-teal-600 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-semibold text-slate-800">Case lifecycle</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-medium">
                  Designated
                </span>
              </div>
              {["Submitted", "Under review", "Designated + certificate", "Renewal / suspend / revoke"].map(
                (step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{step}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Featured designated startups
              </h2>
              <p className="text-slate-600">Recently designated by MinT</p>
            </div>
            <Link
              to="/directory"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((s) => (
                <StartupCard key={s._id} startup={s} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500 mb-4">No designated startups yet.</p>
              <Link to="/register" className="text-teal-700 font-medium text-sm hover:underline">
                Be the first to apply →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to join the official designation system?
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto">
            Founders, investors, ecosystem builders, and MinT staff — one portal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-teal-900 font-semibold rounded-xl hover:bg-teal-50"
            >
              Create account
            </Link>
            <Link
              to="/directory"
              className="px-6 py-3 bg-teal-600/50 border border-white/30 text-white font-semibold rounded-xl hover:bg-teal-600/70"
            >
              Browse directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}