import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  BadgeCheck,
  ArrowRight,
  Building2,
  Users,
  Award,
  Loader2,
  Network,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import StartupCard from "../components/StartupCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [startupsRes, statsRes, buildersRes] = await Promise.all([
          apiRequest("/startups").catch(() => ({ data: [] })),
          apiRequest("/startups/public-stats").catch(() => ({ data: null })),
          apiRequest("/ecosystem-builders/public").catch(() => ({ data: [] })),
        ]);
        setFeatured((startupsRes.data || []).slice(0, 3));
        setStats(statsRes.data || null);
        setBuilders((buildersRes.data || []).slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-100 text-xs font-medium mb-6">
              <Shield size={13} /> Official MinT portal · Proclamation 1396/2025
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Ethiopia&apos;s official
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-amber-200">
                startup designation portal
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Apply for MinT designation, receive certificates, manage secure
              data rooms, and connect founders with investors and ecosystem
              builders under a transparent government workflow.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/directory"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl"
              >
                Designated startups <ArrowRight size={18} />
              </Link>
              <Link
                to="/builders"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20"
              >
                Ecosystem builders
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10"
              >
                Create account
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Designated startups",
                value: stats?.verifiedStartups ?? featured.length ?? "—",
              },
              {
                label: "Active investors",
                value: stats?.totalInvestors ?? "—",
              },
              {
                label: "Applications",
                value: stats?.totalStartups ?? "—",
              },
              {
                label: "Ecosystem builders",
                value: builders.length || "—",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
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
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              How the portal works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">
              Designation is the trust anchor for startups and support
              organizations.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Founders",
                desc: "Submit eligibility data, receive MinT review, obtain a certificate, and control data-room access.",
              },
              {
                icon: Users,
                title: "Investors",
                desc: "Browse designated startups, request data-room access, and track approvals in one workspace.",
              },
              {
                icon: Network,
                title: "Ecosystem builders",
                desc: "Incubators, hubs, and accelerators apply for designation and appear in the public builders registry.",
              },
              {
                icon: Award,
                title: "MinT admin",
                desc: "Case review, designate or reject, suspend or revoke, certificates, and full audit trails.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Designated startups
              </h2>
              <p className="text-slate-600 text-sm">
                Recently designated by MinT
              </p>
            </div>
            <Link
              to="/directory"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
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
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-slate-500 mb-4 text-sm">
                No designated startups published yet.
              </p>
              <Link
                to="/register"
                className="text-teal-700 font-medium text-sm hover:underline"
              >
                Apply for designation →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Ecosystem builders
              </h2>
              <p className="text-slate-600 text-sm">
                Designated incubators, hubs, and support organizations
              </p>
            </div>
            <Link
              to="/builders"
              className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
            </div>
          ) : builders.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {builders.map((b) => (
                <article
                  key={b._id}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Network size={18} className="text-teal-700" />
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {b.organizationName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 capitalize mb-2">
                    {(b.builderType || "").replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {b.description || "No description"}
                  </p>
                  {b.certificateNumber && (
                    <p className="mt-3 text-[11px] text-teal-800 font-medium">
                      {b.certificateNumber}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500">
              No designated ecosystem builders published yet.
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-teal-100 text-sm mb-3">
            <BadgeCheck size={16} /> Official registry
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Join the MinT digital designation system
          </h2>
          <p className="text-teal-100 mb-8 max-w-xl mx-auto text-sm">
            Founders, investors, ecosystem builders, and citizens — one portal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-teal-900 font-semibold rounded-xl hover:bg-teal-50 text-sm"
            >
              Create account
            </Link>
            <Link
              to="/directory"
              className="px-6 py-3 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 text-sm"
            >
              Browse startups
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}