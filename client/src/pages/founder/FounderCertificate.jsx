import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../utils/api";
import { useDesignation } from "../../context/DesignationContext";
import AppShell from "../../components/AppShell";
import CertificateView from "../../components/common/CertificateView";
import { Loader2, Award, ArrowLeft } from "lucide-react";

export default function FounderCertificate() {
  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState("");
  const { applications } = useDesignation();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/certificates/my");
        if (res.data) {
          setCert(res.data);
        } else {
          // Fallback to designated app in context if any
          const designated = applications.find(a => a.status === "designated");
          if (designated) {
            setCert(designated);
          } else {
            setError("No certificate issued yet");
          }
        }
      } catch (err) {
        const designated = applications.find(a => a.status === "designated");
        if (designated) {
          setCert(designated);
        } else {
          setError(err.message || "No certificate yet");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applications]);

  return (
    <AppShell
      title="Designation Certificate"
      subtitle="Official Proclamation No. 1396/2025 Statutory Record"
      actions={
        <Link
          to="/founder"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Workspace
        </Link>
      }
    >
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error && !cert ? (
        <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Award className="mx-auto text-slate-300" size={44} />
          <h2 className="font-bold text-slate-900 text-lg">No Active Certificate Yet</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {error || "Your digital QR-verified designation certificate will be published automatically once your filing is approved by the MinT Secretariat."}
          </p>
          <Link
            to="/founder/create"
            className="inline-block px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Check Application Status
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          <CertificateView
            application={
              cert.startupName
                ? {
                    legalName: cert.startupName,
                    tradeName: cert.tradeName,
                    sector: cert.sector,
                    growthStage: cert.growthStage,
                    tin: cert.tin || "0099887766",
                    commercialRegNo: cert.commercialRegNo || "ET/AA/2023/1234",
                    headquarters: "Addis Ababa, Ethiopia",
                    certificate: cert,
                  }
                : cert
            }
          />
        </div>
      )}
    </AppShell>
  );
}
