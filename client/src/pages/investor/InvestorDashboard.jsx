import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import StartupCard from "../../components/StartupCard";
import {
  Search,
  Send,
  CheckCircle,
  Clock,
  Loader2,
  Inbox,
  Briefcase,
  Building2,
} from "lucide-react";

/**
 * Investor Discover page
 * - Stats + access requests + recommended designated startups
 * - NO document upload (that is founder /founder/data-room only)
 */
export default function InvestorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, startupsRes] = await Promise.all([
          apiRequest("/access-requests/my"),
          apiRequest("/startups"),
        ]);
        setRequests(requestsRes.data || []);
        setRecommended((startupsRes.data || []).slice(0, 6));
      } catch (err) {
        console.error(err);
        toast(err.message || "Failed to load investor hub", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;

  if (loading) {
    return (
      <AppShell title="Discover" subtitle="Loading…">
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-500">Loading investor hub…</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Discover"
      subtitle={`Welcome, ${user?.fullName || "Investor"} · Find designated startups`}
      actions={
        <Link
          to="/investor/directory"
          className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl"
        >
          <Search size={16} /> Browse directory
        </Link>
      }
    >
      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Requests sent"
          value={requests.length}
          icon={Send}
          color="blue"
        />
        <StatCard
          label="Approved"
          value={approvedCount}
          icon={CheckCircle}
          color="teal"
        />
        <StatCard
          label="Pending"
          value={pendingCount}
          icon={Clock}
          color="amber"
        />
        <StatCard
          label="Focus sectors"
          value={user?.focus?.length || 0}
          icon={Building2}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Access requests — NOT document upload */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">My access requests</h2>
            <Link
              to="/investor/directory"
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              Browse startups
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="text-slate-400" size={22} />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  No access requests yet
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Open a designated startup and click &quot;Request data room&quot;.
                  Founders approve access — you never upload files here.
                </p>
                <Link
                  to="/investor/directory"
                  className="text-sm font-medium text-teal-700 hover:underline"
                >
                  Browse directory →
                </Link>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req._id}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm truncate">
                      {req.startup?.companyName || "Startup"}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requested{" "}
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString()
                        : "—"}
                      {req.startup?._id && (
                        <>
                          {" · "}
                          <Link
                            to={`/investor/directory/${req.startup._id}`}
                            className="text-teal-700 hover:underline"
                          >
                            View
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize shrink-0 ${
                      req.status === "approved"
                        ? "bg-teal-50 text-teal-700"
                        : req.status === "pending"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-3">Your profile</h3>
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="text-slate-400">Organization:</span>{" "}
                {user?.organization || "Not set"}
              </p>
              <p>
                <span className="text-slate-400">Range:</span>{" "}
                {user?.investmentRange || "Not set"}
              </p>
              <p>
                <span className="text-slate-400">Focus:</span>{" "}
                {user?.focus?.length ? user.focus.join(", ") : "Not set"}
              </p>
            </div>
            <Link
              to="/profile"
              className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
            >
              Edit profile →
            </Link>
          </div>

          <Link
            to="/investor/directory"
            className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl"
          >
            <Search size={16} /> Explore directory
          </Link>

          <Link
            to="/investor/opportunities"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 hover:border-teal-300 text-slate-800 text-sm font-semibold rounded-xl"
          >
            <Briefcase size={16} /> Post job / internship
          </Link>

          <Link
            to="/investor/browse-opportunities"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 hover:border-teal-300 text-slate-800 text-sm font-semibold rounded-xl"
          >
            View all opportunities
          </Link>
        </div>
      </div>

      {/* Recommended startups */}
      {recommended.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Designated startups</h2>
            <Link
              to="/investor/directory"
              className="text-sm text-teal-700 hover:underline"
            >
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommended.map((s) => (
              <StartupCard
                key={s._id || s.id}
                startup={s}
                to={`/investor/directory/${s._id || s.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}