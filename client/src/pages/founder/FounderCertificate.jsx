import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import { Loader2, Award, ArrowLeft } from "lucide-react";

export default function FounderCertificate() {
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/certificates/my");
        setCert(res.data);
      } catch (err) {
        setError(err.message || "No certificate yet");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <AppShell
      title="Designation certificate"
      subtitle="Official MinT designation record"
      actions={
        <Link
          to="/founder"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      }
    >
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error || !cert ? (
        <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Award className="mx-auto text-slate-300 mb-3" size={36} />
          <h2 className="font-semibold text-slate-900 mb-2">No certificate yet</h2>
          <p className="text-sm text-slate-500 px-6">
            {error ||
              "Your certificate will appear here after MinT designates your startup."}
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white px-8 py-6">
            <div className="text-xs uppercase tracking-widest text-teal-100 mb-2">
              Ministry of Innovation and Technology
            </div>
            <h2 className="text-2xl font-bold">Startup Designation Certificate</h2>
          </div>
          <div className="px-8 py-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Certificate number</div>
                <div className="text-lg font-semibold text-slate-900">
                  {cert.certificateNumber}
                </div>
              </div>
              <StatusBadge status={cert.status === "active" ? "designated" : cert.status} />
            </div>
            <Row label="Startup" value={cert.startupName} />
            <Row label="Founder(s)" value={cert.founderNames || "—"} />
            <Row label="Sector" value={cert.sector || "—"} />
            <Row label="Growth stage" value={cert.growthStage || "—"} />
            <Row
              label="Issued"
              value={cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "—"}
            />
            <Row
              label="Valid until"
              value={cert.expiresAt ? new Date(cert.expiresAt).toLocaleDateString() : "—"}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b border-slate-100 pb-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}