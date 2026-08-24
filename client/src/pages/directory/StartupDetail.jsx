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
  Download,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function StartupDetail({ embedded = false }) {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [myRequest, setMyRequest] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  const backPath =
    embedded && user?.role === "investor"
      ? "/investor/directory"
      : embedded && user?.role === "citizen"
      ? "/citizen/directory"
      : "/directory";

  const loadAccessAndDocs = async () => {
    if (!isAuthenticated || user?.role !== "investor") return;
    try {
      const reqRes = await apiRequest("/access-requests/my");
      const list = reqRes.data || [];
      const mine = list.find(
        (r) =>
          r.startup?._id === id ||
          r.startup === id ||
          String(r.startup?._id || r.startup) === String(id)
      );
      setMyRequest(mine || null);

      if (mine?.status === "approved") {
        setDocsLoading(true);
        try {
          const docsRes = await apiRequest(`/documents/startup/${id}`);
          setDocs(docsRes.data || []);
        } catch {
          setDocs([]);
        } finally {
          setDocsLoading(false);
        }
      } else {
        setDocs([]);
      }
    } catch {
      setMyRequest(null);
      setDocs([]);
    }
  };

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

  useEffect(() => {
    if (startup && isAuthenticated && user?.role === "investor") {
      loadAccessAndDocs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startup, isAuthenticated, user?.role, id]);

  const requestAccess = async () => {
    if (!isAuthenticated || user?.role !== "investor") {
      toast("Sign in as an investor to request data room access", "info");
      return;
    }
    setRequesting(true);
    try {
      const res = await apiRequest("/access-requests", {
        method: "POST",
        body: { startupId: id },
      });
      setMyRequest(res.data || { status: "pending" });
      toast("Access request sent to the founder", "success");
    } catch (err) {
      toast(err.message || "Request failed", "error");
      await loadAccessAndDocs();
    } finally {
      setRequesting(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await apiRequest(`/documents/${doc._id}/download`, { blob: true });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalName || "document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast(err.message || "Download failed", "error");
    }
  };

  if (loading) {
    const spinner = (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
    if (embedded) return <AppShell title="Startup">{spinner}</AppShell>;
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
    if (embedded) return <AppShell title="Not found">{missing}</AppShell>;
    return missing;
  }

  const accessStatus = myRequest?.status;

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
                <h1 className="text-2xl font-bold text-slate-900">{startup.companyName}</h1>
                {isDesignated(startup.status) && <StatusBadge status={startup.status} />}
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
              <div className="shrink-0">
                {!accessStatus && (
                  <button
                    onClick={requestAccess}
                    disabled={requesting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-semibold rounded-xl"
                  >
                    {requesting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Request data room
                  </button>
                )}
                {accessStatus === "pending" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-800 text-sm font-semibold rounded-xl border border-amber-100">
                    <Clock size={16} /> Request pending
                  </span>
                )}
                {accessStatus === "approved" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-800 text-sm font-semibold rounded-xl border border-teal-100">
                    <CheckCircle size={16} /> Access approved
                  </span>
                )}
                {accessStatus === "denied" && (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 text-sm font-semibold rounded-xl border border-red-100">
                    <XCircle size={16} /> Request denied
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 sm:px-8 py-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Problem
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{startup.problemStatement}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Solution
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{startup.solutionStatement}</p>
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
                · Valid until {new Date(startup.designationExpiresAt).toLocaleDateString()}
              </>
            )}
          </div>
        )}
      </div>

      {/* Data room files — only when investor access is approved */}
      {user?.role === "investor" && accessStatus === "approved" && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-teal-700" />
              Data room files
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Founder approved your access. You may download these documents.
            </p>
          </div>
          {docsLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-teal-600" />
            </div>
          ) : docs.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No documents uploaded yet by the founder.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {docs.map((doc) => (
                <div
                  key={doc._id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-teal-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">{doc.title}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {doc.originalName} · {formatSize(doc.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shrink-0"
                  >
                    <Download size={13} /> Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <AppShell title={startup.companyName} subtitle="Company profile">
        {page}
      </AppShell>
    );
  }

  return page;
}