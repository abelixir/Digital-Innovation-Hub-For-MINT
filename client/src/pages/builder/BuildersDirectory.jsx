import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import {
  Loader2,
  Globe,
  MapPin,
  ExternalLink,
  Building2,
  Network,
  ShieldCheck,
  Search,
  Users,
  Award,
  Sparkles,
  Zap,
  CheckCircle,
  Filter,
} from "lucide-react";

const BUILDER_TYPES = [
  { id: "all", label: "All Hub Types" },
  { id: "incubator", label: "Incubators", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { id: "accelerator", label: "Accelerators", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { id: "tech_park", label: "Tech Parks & Zones", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { id: "university_hub", label: "University Labs", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { id: "co_working", label: "Coworking & Labs", color: "bg-teal-50 text-teal-800 border-teal-200" },
];

export default function BuildersDirectory() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/ecosystem-builders/public");
        setBuilders(res.data || []);
      } catch (err) {
        console.error("Failed to load ecosystem builders", err);
        setBuilders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = builders.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      b.organizationName?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.location?.toLowerCase().includes(q) ||
      b.builderType?.toLowerCase().includes(q);

    const matchesType =
      selectedType === "all" ||
      (b.builderType && b.builderType.toLowerCase().includes(selectedType.toLowerCase()));

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sovereign Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 p-8 text-white shadow-xl border border-purple-900/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            <Network className="w-3.5 h-3.5" />
            <span>National Innovation Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accredited Ecosystem Builders & Innovation Hubs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Audited network of technology incubators, venture accelerators, prototyping labs, and university innovation centers certified under Proclamation No. 1396/2025.
          </p>
        </div>
      </div>

      {/* Filter and Search Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ecosystem hubs by organization name, specialization, or regional location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-2xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Hub Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {BUILDER_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedType === type.id
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-600/20"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{filtered.length}</strong> accredited innovation hubs
        </span>
        <span className="flex items-center gap-1 text-purple-700 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>Statutorily Accredited</span>
        </span>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-xs text-slate-500 font-medium">Querying sovereign builder registry...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No ecosystem builders registered</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hubs and accelerators can apply for official MinT accreditation to appear in this sovereign directory and host national programs.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div
              key={b._id || b.id}
              className="group bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-purple-400/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Accent top gradient stripe */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500" />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {b.logo || "🏢"}
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                    {(b.builderType || "Incubator").replace(/_/g, " ")}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-900 transition-colors line-clamp-1">
                  {b.organizationName}
                </h3>

                {b.description && (
                  <p className="text-xs text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                    {b.description}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs text-slate-500">
                  {b.location && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.location}</span>
                    </span>
                  )}
                  {b.supportedStartups != null && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.supportedStartups} Cohorts Assisted</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MinT Accredited
                </span>

                {b.website && (
                  <a
                    href={b.website.startsWith("http") ? b.website : `https://${b.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 text-purple-800 hover:bg-purple-100 font-bold text-xs transition-colors"
                  >
                    <span>Visit Hub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
