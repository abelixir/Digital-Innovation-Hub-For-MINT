import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { MapPin, Users } from "lucide-react";
import { isDesignated } from "../utils/status";

export default function StartupCard({ startup, to }) {
  const id = startup._id || startup.id;
  const href = to || `/directory/${id}`;
  const designated = isDesignated(startup.status);

  return (
    <Link
      to={href}
      className="group block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0">
          {startup.logo || "🚀"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 group-hover:text-teal-800 truncate">
              {startup.companyName}
            </h3>
            {designated && <StatusBadge status={startup.status} />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {startup.sector} · {startup.fundingStage}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {startup.oneLineDescription}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} /> {startup.location}
        </span>
        {startup.teamSize != null && (
          <span className="inline-flex items-center gap-1">
            <Users size={12} /> {startup.teamSize}
          </span>
        )}
      </div>
    </Link>
  );
}