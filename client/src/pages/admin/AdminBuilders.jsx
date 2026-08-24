import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/ui/Modal";
import { Loader2, CheckCircle, XCircle, Building2, Ban } from "lucide-react";

export default function AdminBuilders() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [modal, setModal] = useState(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await apiRequest(`/ecosystem-builders/admin${params}`);
      setItems(res.data || []);
    } catch (err) {
      toast(err.message || "Failed to load", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const submit = async () => {
    if (!modal) return;
    if ((modal.action === "reject" || modal.action === "suspend") && !reason.trim()) {
      toast("Reason is required", "error");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(`/ecosystem-builders/${modal.id}/${modal.action}`, {
        method: "PATCH",
        body: { reason: reason.trim(), notes: notes.trim() },
      });
      const msg =
        modal.action === "approve"
          ? "Builder designated"
          : modal.action === "reject"
          ? "Application rejected"
          : "Builder suspended";
      toast(msg, "success");
      setModal(null);
      setReason("");
      setNotes("");
      await load();
    } catch (err) {
      toast(err.message || "Action failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell
      title="Ecosystem builders"
      subtitle="Final decisions after reviewer evaluation"
    >
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        Prefer designating cases that are <strong>under review</strong> (reviewer notes appear below each card).
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["pending", "under_review", "designated", "rejected", "suspended", "all"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize ${
              filter === f
                ? "bg-teal-50 border-teal-500 text-teal-800"
                : "bg-white border-slate-200 text-slate-600"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="mx-auto text-slate-300 mb-3" size={28} />
          <p className="text-sm font-medium text-slate-700">No applications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-lg">{b.logo || "🏢"}</span>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {b.organizationName}
                  </h3>
                  <StatusBadge status={b.status} />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {(b.builderType || "").replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{b.description}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {b.country || "—"} · {b.ownerUser?.fullName} · {b.ownerUser?.email}
                  {b.certificateNumber && ` · ${b.certificateNumber}`}
                </p>
                {b.adminNotes && (
                  <p className="text-xs text-blue-800 mt-2 bg-blue-50 rounded-lg px-2 py-1.5 border border-blue-100">
                    <strong>Reviewer / audit notes:</strong> {b.adminNotes}
                  </p>
                )}
                {b.rejectionReason && (
                  <p className="text-xs text-red-700 mt-1">Reject reason: {b.rejectionReason}</p>
                )}
                {b.suspensionReason && (
                  <p className="text-xs text-amber-700 mt-1">Suspend reason: {b.suspensionReason}</p>
                )}
              </div>
              {["pending", "submitted", "under_review"].includes(b.status) && (
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setModal({ id: b._id, action: "approve" })}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-teal-600 rounded-lg"
                  >
                    <CheckCircle size={13} /> Designate
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal({ id: b._id, action: "reject" })}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              )}
              {b.status === "designated" && (
                <button
                  type="button"
                  onClick={() => setModal({ id: b._id, action: "suspend" })}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 rounded-lg shrink-0"
                >
                  <Ban size={13} /> Suspend
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={
          modal?.action === "approve"
            ? "Designate ecosystem builder"
            : modal?.action === "reject"
            ? "Reject application"
            : "Suspend designation"
        }
        footer={
          <>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="px-4 py-2 text-sm rounded-xl border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className={`px-4 py-2 text-sm font-semibold rounded-xl text-white ${
                modal?.action === "approve"
                  ? "bg-teal-600"
                  : modal?.action === "reject"
                  ? "bg-red-600"
                  : "bg-amber-600"
              }`}
            >
              {saving ? "Saving…" : "Confirm"}
            </button>
          </>
        }
      >
        {(modal?.action === "reject" || modal?.action === "suspend") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Internal notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            placeholder="Optional"
          />
        </div>
      </Modal>
    </AppShell>
  );
}