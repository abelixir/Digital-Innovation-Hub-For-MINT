import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import Modal from "../../components/ui/Modal";
import {
  Loader2,
  Building2,
  MapPin,
  Globe,
  Search,
  Send,
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
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [interestTarget, setInterestTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
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

  useEffect(() => {
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

  const canExpressInterest =
    isAuthenticated &&
    (user?.role === "investor" ||
      user?.role === "founder" ||
      user?.role === "citizen");

  const sendInterest = async () => {
    if (!interestTarget) return;
    setSending(true);
    try {
      await apiRequest(`/ecosystem-builders/${interestTarget._id}/interest`, {
        method: "POST",
        body: { message: message.trim() },
      });
      toast("Interest sent to the organization", "success");
      setInterestTarget(null);
      setMessage("");
    } catch (err) {
      toast(
        err.message ||
          "Could not send interest. The organization website may still be used for contact.",
        "error"
      );
    } finally {
      setSending(false);
    }
  };

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
        <div className="mb-6">
          <ErrorState message={error} onRetry={load} />
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : filtered.length === 0 && !error ? (
        <EmptyState
          icon={Building2}
          title="No designated builders yet"
          description="When MinT designates an organization, it will appear here."
        />
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            Showing {filtered.length} builder{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <article
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-teal-200 transition-all flex flex-col"
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
                <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                  {b.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-3">
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
                  <p className="text-[11px] text-teal-800 bg-teal-50 rounded-lg px-2 py-1 mb-3">
                    Cert: {b.certificateNumber}
                  </p>
                )}
                {canExpressInterest && (
                  <button
                    type="button"
                    onClick={() => {
                      setInterestTarget(b);
                      setMessage("");
                    }}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                  >
                    <Send size={14} /> Express interest
                  </button>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      <Modal
        open={!!interestTarget}
        onClose={() => !sending && setInterestTarget(null)}
        title="Express interest"
        footer={
          <>
            <button
              type="button"
              onClick={() => setInterestTarget(null)}
              disabled={sending}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={sendInterest}
              disabled={sending}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-teal-600 disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 mb-3">
          Message to{" "}
          <strong>{interestTarget?.organizationName}</strong>. They will be
          notified by email if contact is configured.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Brief introduction and why you are reaching out…"
          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </Modal>
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