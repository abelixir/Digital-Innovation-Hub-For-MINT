import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import {
  Loader2,
  Building2,
  MapPin,
  Globe,
  Search,
} from "lucide-react";

const TYPE_LABELS = {
  incubator: "Incubator",
  accelerator: "Accelerator",
  coworking: "Coworking / hub",
  angel_network: "Angel network",
  university: "University",
  research: "Research",
  ngo: "NGO",
  other: "Other",
};

export default function BuildersDirectory({ embedded = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/ecosystem-builders/public");
        setItems(res.data || []);
      } catch (err) {
        setError(err.message || "Failed to load builders");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = items.filter((b) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      b.organizationName?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.location?.toLowerCase().includes(q);
    const matchType = !type || b.builderType === type;
    return matchQ && matchType;
  });

  const body = (
    <>
      {!embedded && (
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Designated ecosystem builders
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-2xl">
            Incubators, accelerators, hubs and other organizations designated by
            MinT. These are support organizations — not startups.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organization, location…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="font-medium text-slate-700">No designated builders yet</p>
          <p className="text-xs text-slate-500 mt-1">
            When MinT designates an organization, it will appear here.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Showing {filtered.length} builder{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <article
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <StatusBadge status={b.status || "designated"} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  {b.organizationName}
                </h3>
                <p className="text-xs text-slate-500 mb-2 capitalize">
                  {TYPE_LABELS[b.builderType] || b.builderType}
                </p>
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {b.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  {b.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} /> {b.location}
                    </span>
                  )}
                  {b.website && (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-teal-700 hover:underline"
                    >
                      <Globe size={12} /> Website
                    </a>
                  )}
                </div>
                {b.certificateNumber && (
                  <p className="mt-3 text-[11px] text-teal-800 bg-teal-50 rounded-lg px-2 py-1">
                    Cert: {b.certificateNumber}
                  </p>
                )}
                {b.resources && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(b.resources)
                      .filter(([k, v]) => k !== "other" && v === true)
                      .map(([k]) => (
                        <span
                          key={k}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-slate-50 border border-slate-200 text-slate-600 capitalize"
                        >
                          {k.replace(/([A-Z])/g, " $1")}
                        </span>
                      ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );

  if (embedded) {
    return (
      <AppShell
        title="Ecosystem builders"
        subtitle="MinT-designated incubators, hubs and support organizations"
      >
        {body}
      </AppShell>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{body}</div>
  );
}