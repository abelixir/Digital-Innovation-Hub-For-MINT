import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api";
import { useToast } from "../../context/ToastContext";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import { Loader2, Building2 } from "lucide-react";

export default function ReviewerBuilders() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await apiRequest(`/ecosystem-builders/admin${params}`);
      setItems(res.data || []);
    } catch (err) {
      toast(err.message || "Failed to load builders", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <AppShell
      title="Ecosystem builders"
      subtitle="Read-only view · final decisions are Admin only"
    >
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        You can inspect builder applications. You cannot designate or reject them.
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "designated", "rejected"].map((f) => (
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
              className="bg-white rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {b.organizationName}
                </h3>
                <StatusBadge status={b.status} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {(b.builderType || "").replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{b.description}</p>
              <p className="text-xs text-slate-400 mt-1">
                {b.ownerUser?.fullName} · {b.ownerUser?.email}
                {b.certificateNumber && ` · ${b.certificateNumber}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}