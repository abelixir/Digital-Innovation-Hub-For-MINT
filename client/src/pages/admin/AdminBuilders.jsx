import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/ui/Modal";
import { Loader2, CheckCircle, XCircle, Building2 } from "lucide-react";

export default function AdminBuilders() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [modal, setModal] = useState(null); // { id, action }
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
    if (modal.action === "reject" && !reason.trim()) {
      toast("Reason is required to reject", "error");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(`/ecosystem-builders/${modal.id}/${modal.action}`, {
        method: "PATCH",
        body: { reason: reason.trim(), notes: notes.trim() },
      });
      toast(
        modal.action === "approve" ? "Builder designated" : "Application rejected",
        "success"
      );
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
      subtitle="Review incubator / hub designation applications"
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {["pending", "designated", "rejected", "all"].map((f) => (
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
            {f}
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
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {b.organizationName}
                  </h3>
                  <StatusBadge status={b.status} />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {(b.builderType || "").replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {b.description}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {b.ownerUser?.fullName} · {b.ownerUser?.email}
                  {b.certificateNumber && ` · ${b.certificateNumber}`}
                </p>
              </div>
              {b.status === "pending" && (
                <div className="flex gap-2 shrink-0">
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
            : "Reject application"
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
                modal?.action === "approve" ? "bg-teal-600" : "bg-red-600"
              }`}
            >
              {saving ? "Saving…" : "Confirm"}
            </button>
          </>
        }
      >
        {modal?.action === "reject" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Internal notes
          </label>
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