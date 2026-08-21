export default function StatCard({ label, value, icon: Icon, color = "teal", hint }) {
  const colors = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
    primary: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {label}
          </p>
          <div className="mt-2 text-2xl font-bold text-slate-900 break-words">
            {value ?? "—"}
          </div>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              colors[color] || colors.teal
            }`}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}