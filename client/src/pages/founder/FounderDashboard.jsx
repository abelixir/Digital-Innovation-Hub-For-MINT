import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { isDesignated } from "../../utils/status";
import {
  FileText,
  Inbox,
  Eye,
  BadgeCheck,
  PlusCircle,
  Loader2,
  AlertCircle,
  Check,
  X,
  Award,
} from "lucide-react";

export default function FounderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [requests, setRequests] = useState([]);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = async () => {
    try {
      const startupRes = await apiRequest("/startups/my");
      setStartup(startupRes.data);
      setEligibility(startupRes.eligibility || null);

      try {
        const [reqRes, docsRes] = await Promise.all([
          apiRequest("/access-requests/incoming"),
          apiRequest("/documents/my"),
        ]);
        setRequests(reqRes.data || []);
        setDocCount(docsRes.count || docsRes.data?.length || 0);
      } catch {
        setRequests([]);
      }
    } catch (err) {
      if (err.message?.toLowerCase().includes("no startup")) {
        setStartup(null);
      } else {
        toast(err.message || "Failed to load dashboard", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      await apiRequest(`/access-requests/${id}/${action}`, { method: "PATCH" });
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: action === "approve" ? "approved" : "denied" }
            : r
        )
      );
      toast(action === "approve" ? "Access approved" : "Access denied", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenew = async () => {
    try {
      await apiRequest("/startups/my/renew", { method: "POST", body: {} });
      toast("Renewal request submitted", "success");
      await fetchData();
    } catch (err) {
      toast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <AppShell title="Founder workspace">
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </AppShell>
    );
  }

  if (!startup) {
    return (
      <AppShell title="Founder workspace" subtitle={`Welcome, ${user?.fullName}`}>
        <div className="max-w-xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PlusCircle className="text-teal-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Apply for Startup Designation
          </h2>
          <p className="text-slate-500 mb-8">
            Submit your application under Proclamation 1396/2025 to receive MinT
            designation and appear in the trusted directory.
          </p>
          <Link
            to="/founder/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
          >
            <PlusCircle size={18} /> Start application
          </Link>
        </div>
      </AppShell>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <AppShell
      title="Founder workspace"
      subtitle={`Welcome back, ${user?.fullName}`}
      actions={
        <Link
          to="/founder/create"
          className="px-3 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700"
        >
          Edit application
        </Link>
      }
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Designation status"
          value={<StatusBadge status={startup.status} />}
          icon={BadgeCheck}
          color={isDesignated(startup.status) ? "teal" : "amber"}
        />
        <StatCard label="Data room docs" value={docCount} icon={FileText} color="blue" />
        <StatCard label="Pending requests" value={pending.length} icon={Inbox} color="amber" />
        <StatCard label="Total requests" value={requests.length} icon={Eye} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Incoming access requests</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {pending.length} pending
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="mx-auto text-slate-300 mb-3" size={28} />
                <p className="text-sm font-medium text-slate-700">No access requests yet</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="px-6 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-slate-900 text-sm">
                        {req.investor?.fullName || "Investor"}
                      </div>
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <div>Org: {req.investor?.organization || "—"}</div>
                        <div>Range: {req.investor?.investmentRange || "—"}</div>
                        <div>
                          Requested {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(req._id, "approve")}
                            disabled={actionLoading === req._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg disabled:opacity-50"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "deny")}
                            disabled={actionLoading === req._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg disabled:opacity-50"
                          >
                            <X size={13} /> Deny
                          </button>
                        </>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${
                            req.status === "approved"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                {startup.logo}
              </div>
              <div>
                <div className="font-medium text-slate-900 text-sm">{startup.companyName}</div>
                <StatusBadge status={startup.status} />
              </div>
            </div>

            {startup.reviewDueAt &&
              ["pending", "submitted", "under_review"].includes(startup.status) && (
                <p className="text-xs text-slate-500 mb-3">
                  Review due: {new Date(startup.reviewDueAt).toLocaleDateString()}
                </p>
              )}

            {eligibility && !eligibility.ok && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-800 flex gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>Some eligibility fields still need attention before designation.</span>
              </div>
            )}

            <div className="space-y-1">
              <Link
                to="/founder/create"
                className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Edit designation application
              </Link>
              <Link
                to="/founder/data-room"
                className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Manage data room
              </Link>
              <Link
                to="/founder/certificate"
                className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                View certificate
              </Link>
              {isDesignated(startup.status) && (
                <Link
                  to={`/directory/${startup._id}`}
                  className="block w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  Public profile
                </Link>
              )}
            </div>
          </div>

          {isDesignated(startup.status) && (
            <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-teal-700" />
                <h3 className="font-semibold text-teal-900">MinT Designated</h3>
              </div>
              <p className="text-sm text-teal-800 mb-3">
                Certificate {startup.certificateNumber || "issued"}.
                {startup.designationExpiresAt &&
                  ` Valid until ${new Date(startup.designationExpiresAt).toLocaleDateString()}.`}
              </p>
              <button
                onClick={handleRenew}
                className="text-xs font-semibold text-teal-800 underline"
              >
                Request renewal
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}