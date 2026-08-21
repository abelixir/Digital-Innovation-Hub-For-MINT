import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/AppShell";
import StartupCard from "../../components/StartupCard";
import { SECTORS, STAGES } from "../../data/mockData";
import { Search, Loader2, Building2 } from "lucide-react";

export default function Directory({ embedded = false }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");

  // Base path for detail links when inside console
  const detailBase =
    embedded && user?.role === "investor"
      ? "/investor/directory"
      : embedded && user?.role === "citizen"
      ? "/citizen/directory"
      : "/directory";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/startups");
        setStartups(res.data || []);
      } catch {
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = startups.filter((s) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      s.companyName?.toLowerCase().includes(q) ||
      s.oneLineDescription?.toLowerCase().includes(q);
    const matchSector = !sector || s.sector === sector;
    const matchStage = !stage || s.fundingStage === stage;
    return matchQ && matchSector && matchStage;
  });

  const body = (
    <>
      {!embedded && (
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Designated startups
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Public directory of startups designated by MinT.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or description…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="font-medium text-slate-700">No designated startups found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Showing {filtered.length} startup{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <div
                key={s._id || s.id}
                onClick={() => navigate(`${detailBase}/${s._id || s.id}`)}
                className="cursor-pointer"
              >
                <StartupCard startup={s} to={`${detailBase}/${s._id || s.id}`} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  if (embedded || (isAuthenticated && (user?.role === "investor" || user?.role === "citizen"))) {
    return (
      <AppShell title="Designated startups" subtitle="Browse MinT-designated companies">
        {body}
      </AppShell>
    );
  }

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{body}</div>;
}