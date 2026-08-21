import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import { isDesignated } from "../../utils/status";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Users,
  Globe,
  Send,
} from "lucide-react";

export default function StartupDetail({ embedded = false }) {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  const backPath =
    embedded && user?.role === "investor"
      ? "/investor/directory"
      : embedded && user?.role === "citizen"
      ? "/citizen/directory"
      : "/directory";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest(`/startups/${id}`);
        setStartup(res.data);
      } catch (err) {
        toast(err.message || "Failed to load startup", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const requestAccess = async () => {
    if (!isAuthenticated || user?.role !== "investor") {
      toast("Sign in as an investor to request data room access", "info");
      return;
    }
    setRequesting(true);
    try {
      await apiRequest("/access-requests", {
        method: "POST",
        body: { startupId: id },
      });
      toast("Access request sent to the founder", "success");
    } catch (err) {
      toast(err.message || "Request failed", "error");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    const spinner = (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
    if (embedded) {
      return <AppShell title="Startup">{spinner}</AppShell>;
    }
    return spinner;
  }

  if (!startup) {
    const missing = (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">Startup not found or not public.</p>
        <Link to={backPath} className="text-teal-700 font-medium">
          ← Back to directory
        </Link>
      </div>
    );
    if (embedded) {
      return <AppShell title="Not found">{missing}</AppShell>;
    }
    return missing;
  }

  const page = (
    <div className={embedded ? "" : "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"}>
      <Link
        to={backPath}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-800 mb-6"
      >
        <ArrowLeft size={16} /> Directory
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl">
              {startup.logo || "🚀"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">
                  {startup.companyName}
                </h1>
                {isDesignated(startup.status) && (
                  <StatusBadge status={startup.status} />
                )}
              </div>
              <p className="text-slate-600">{startup.oneLineDescription}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span>{startup.sector}</span>
                <span>{startup.fundingStage}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {startup.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={14} /> Team {startup.teamSize}
                </span>
                {startup.website && (
                  <a
                    href={startup.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-teal-700 hover:underline"
                  >
                    <Globe size={14} /> Website
                  </a>
                )}
              </div>
            </div>

            {user?.role === "investor" && isDesignated(startup.status) && (
              <button
                onClick={requestAccess}
                disabled={requesting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-xl shrink-0"
              >
                {requesting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Request data room
              </button>
            )}
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Problem
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {startup.problemStatement}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Solution
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {startup.solutionStatement}
            </p>
          </div>
          {startup.innovationDescription && (
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Innovation
              </h2>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {startup.innovationDescription}
              </p>
            </div>
          )}
        </div>

        {startup.certificateNumber && (
          <div className="px-6 sm:px-8 py-4 bg-teal-50 border-t border-teal-100 text-sm text-teal-900">
            MinT certificate: <strong>{startup.certificateNumber}</strong>
            {startup.designationExpiresAt && (
              <>
                {" "}
                · Valid until{" "}
                {new Date(startup.designationExpiresAt).toLocaleDateString()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return (
      <AppShell
        title={startup.companyName}
        subtitle="Company profile"
      >
        {page}
      </AppShell>
    );
  }

  return page;
}