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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Zap,
  TrendingUp,
  Download,
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
      <AppShell title="Founder Workspace">
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <span className="text-xs text-slate-500 font-medium">Loading founder workspace...</span>
        </div>
      </AppShell>
    );
  }

  if (!startup) {
    return (
      <AppShell title="Founder Workspace" subtitle={`Welcome, ${user?.fullName}`}>
        <div className="max-w-2xl mx-auto py-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl text-center space-y-6">
            <div className="w-16 h-16 bg-teal-500/20 border border-teal-400/30 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-teal-900/40">
              <PlusCircle className="text-teal-300 w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Proclamation No. 1396/2025</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Apply for Official Startup Designation
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Submit your enterprise application under Proclamation No. 1396/2025 to receive official MinT designation, unlock a 3-year profit tax holiday, FX priority lanes, and verified investor data rooms.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/founder/create"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-teal-900/40 hover:scale-[1.02] transition-all"
              >
                <PlusCircle size={18} />
                <span>Start Statutory Application</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");

  const decisionBanner =
    startup.status === "rejected" && startup.rejectionReason
      ? {
          title: "Application rejected",
          reason: startup.rejectionReason,
          className: "bg-rose-50 border-rose-200 text-rose-900",
        }
      : startup.status === "suspended" && startup.suspensionReason
      ? {
          title: "Designation suspended",
          reason: startup.suspensionReason,
          className: "bg-amber-50 border-amber-200 text-amber-900",
        }
      : startup.status === "revoked" && startup.revocationReason
      ? {
          title: "Designation revoked",
          reason: startup.revocationReason,
          className: "bg-rose-50 border-rose-200 text-rose-900",
        }
      : null;

  return (
    <AppShell
      title="Founder Workspace"
      subtitle={`Enterprise Management · ${startup.companyName || startup.legalName || user?.fullName}`}
      actions={
        <Link
          to="/founder/create"
          className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-700 shadow-2xs transition-all"
        >
          Edit Application
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Top Sovereign Status Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-teal-900/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>{startup.companyName || startup.legalName}</span>
                </span>
                <StatusBadge status={startup.status} size="sm" />
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {startup.tradeName ? `"${startup.tradeName}"` : startup.companyName}
              </h1>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                {startup.oneLineDescription || startup.innovationDescription || "Ethiopian Innovation Enterprise"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                to="/founder/certificate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs font-bold hover:bg-teal-500/30 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certificate</span>
              </Link>
              <Link
                to="/founder/data-room"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors"
              >
                <Inbox className="w-4 h-4 text-teal-300" />
                <span>Data Room</span>
              </Link>
            </div>
          </div>
        </div>

        {decisionBanner && (
          <div className={`p-4 rounded-2xl border flex gap-3 ${decisionBanner.className}`}>
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wider">{decisionBanner.title}</div>
              <p className="text-xs mt-1">
                <strong>MinT Directorate Note:</strong> {decisionBanner.reason}
              </p>
            </div>
          </div>
        )}

        {/* Vibrant Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-teal-500/10 via-white to-teal-50 rounded-3xl border border-teal-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <StatusBadge status={startup.status} size="sm" />
            </div>
            <div className="text-base font-black text-slate-900 capitalize">{(startup.status || "Under Review").replace(/_/g, " ")}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Statutory Designation</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 via-white to-blue-50 rounded-3xl border border-blue-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Files</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{docCount}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Data Room Documents</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-50 rounded-3xl border border-amber-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <Inbox className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Pending</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{pending.length}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Pending Investor Inquiries</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 via-white to-purple-50 rounded-3xl border border-purple-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Pipeline</span>
            </div>
            <div className="text-2xl font-black text-slate-900">{requests.length}</div>
            <div className="text-xs text-slate-500 font-semibold mt-0.5">Total Investor Access Views</div>
          </div>
        </div>

        {/* Requests & Quick Management */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Incoming Investor Access Requests</h2>
                <p className="text-xs text-slate-500">Accredited venture funds requesting access to confidential data room</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {pending.length} pending
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <div className="py-12 text-center">
                  <Inbox className="mx-auto text-slate-300 mb-3" size={32} />
                  <p className="text-sm font-bold text-slate-700">No access requests yet</p>
                  <p className="text-xs text-slate-400 mt-1">Once accredited investors discover your public profile, their requests will appear here.</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-sm">
                        {req.investor?.fullName || "Accredited Investor"}
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-3">
                        <span>Org: <strong>{req.investor?.organization || "—"}</strong></span>
                        <span>Ticket: <strong>{req.investor?.investmentRange || "—"}</strong></span>
                        <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAction(req._id, "approve")}
                            disabled={actionLoading === req._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-2xs"
                          >
                            <Check size={14} /> Approve Access
                          </button>
                          <button
                            onClick={() => handleAction(req._id, "deny")}
                            disabled={actionLoading === req._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                          >
                            <X size={14} /> Deny
                          </button>
                        </>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                            req.status === "approved"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Venture Navigation
              </h3>
              <div className="space-y-2 text-xs font-bold">
                <Link
                  to="/founder/create"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/80 transition-colors"
                >
                  <span>Edit Designation Application</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/founder/data-room"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/80 transition-colors"
                >
                  <span>Upload Financials & Pitch Deck</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/founder/certificate"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/80 transition-colors"
                >
                  <span>View Sovereign Certificate</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </Link>
                <Link
                  to="/founder/opportunities"
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-teal-50 text-slate-800 hover:text-teal-900 border border-slate-200/80 transition-colors"
                >
                  <span>Browse Funding & Grants</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
