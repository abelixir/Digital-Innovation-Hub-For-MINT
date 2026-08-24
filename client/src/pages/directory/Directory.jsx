import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/AppShell";
import StartupCard from "../../components/StartupCard";
import { Loader2, Building2 } from "lucide-react";

export default function Directory({ embedded = false }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : startups.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="mx-auto text-slate-300 mb-3" size={32} />
          <p className="font-medium text-slate-700">No designated startups yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups.map((s) => (
            <div
              key={s._id || s.id}
              onClick={() => navigate(`${detailBase}/${s._id || s.id}`)}
              className="cursor-pointer"
            >
              <StartupCard startup={s} to={`${detailBase}/${s._id || s.id}`} />
            </div>
          ))}
        </div>
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