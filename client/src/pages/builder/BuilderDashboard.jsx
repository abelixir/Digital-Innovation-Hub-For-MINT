import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import {
  Loader2,
  Building2,
  Award,
  FileText,
  MapPin,
  Globe,
} from "lucide-react";

export default function BuilderDashboard() {
  const { user } = useAuth();
  const [builder, setBuilder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/ecosystem-builders/my");
        setBuilder(res.data);
        setMissing(false);
      } catch {
        setMissing(true);
        setBuilder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <AppShell title="Ecosystem builder" subtitle="Loading…">
        <div className="min-h-[40vh] flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </AppShell>
    );
  }

  if (missing || !builder) {
    return (
      <AppShell
        title="Ecosystem builder"
        subtitle={`Welcome, ${user?.fullName || "Applicant"}`}
      >
        <div className="max-w-xl bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <Building2 className="mx-auto text-teal-600 mb-4" size={36} />
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Apply for MinT ecosystem builder designation
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            For incubators, accelerators, hubs, coworking spaces, universities and
            other organizations that support startups — not for startup companies
            themselves (those use the Founder role).
          </p>
          <Link
            to="/builder/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl"
          >
            <FileText size={16} /> Start application
          </Link>
        </div>
      </AppShell>
    );
  }

  const designated = builder.status === "designated";

  return (
    <AppShell
      title={builder.organizationName}
      subtitle="Ecosystem builder portal"
      actions={
        <Link
          to="/builder/apply"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white hover:border-teal-300"
        >
          <FileText size={16} /> Edit application
        </Link>
      }
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Status"
          value={<StatusBadge status={builder.status} />}
          icon={Building2}
          color="teal"
        />
        <StatCard
          label="Type"
          value={(builder.builderType || "—").replace("_", " ")}
          icon={FileText}
          color="blue"
        />
        <StatCard
          label="Certificate"
          value={builder.certificateNumber || "—"}
          icon={Award}
          color="purple"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-900">Organization profile</h2>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {builder.description || "No description"}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            {builder.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} /> {builder.location}
              </span>
            )}
            {builder.website && (
              <a
                href={builder.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-teal-700 hover:underline"
              >
                <Globe size={14} /> Website
              </a>
            )}
          </div>
          {builder.resources && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase mb-2">
                Resources offered
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(builder.resources)
                  .filter(([k, v]) => k !== "other" && v === true)
                  .map(([k]) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 text-xs rounded-full bg-teal-50 text-teal-800 border border-teal-100 capitalize"
                    >
                      {k.replace(/([A-Z])/g, " $1")}
                    </span>
                  ))}
                {builder.resources.other && (
                  <span className="px-2.5 py-1 text-xs rounded-full bg-slate-50 text-slate-600 border">
                    {builder.resources.other}
                  </span>
                )}
              </div>
            </div>
          )}
          {builder.status === "rejected" && builder.rejectionReason && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-800">
              <strong>Rejected:</strong> {builder.rejectionReason}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {designated && (
            <div className="bg-teal-50 rounded-2xl border border-teal-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="text-teal-700" />
                <h3 className="font-semibold text-teal-900">MinT designated</h3>
              </div>
              <p className="text-sm text-teal-800">
                Certificate <strong>{builder.certificateNumber}</strong>
                {builder.designationExpiresAt && (
                  <>
                    <br />
                    Valid until{" "}
                    {new Date(builder.designationExpiresAt).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          )}
          {!designated && builder.status === "pending" && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 text-sm text-amber-900">
              Application is in the MinT review queue
              {builder.reviewDueAt && (
                <>
                  . Review target:{" "}
                  {new Date(builder.reviewDueAt).toLocaleDateString()}
                </>
              )}
              .
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}