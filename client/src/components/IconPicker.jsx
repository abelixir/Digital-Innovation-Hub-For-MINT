import * as Lucide from "lucide-react";

const ICON_NAMES = [
  "Rocket", "Building2", "Leaf", "Cpu", "Heart", "GraduationCap",
  "Truck", "Zap", "Wallet", "Globe", "Lightbulb", "Users",
  "Briefcase", "Factory", "Store", "Wifi", "Smartphone", "Cloud",
  "Database", "Shield", "Award", "Target", "TrendingUp", "Package",
  "Sprout", "Stethoscope", "BookOpen", "Landmark", "MapPin", "Code",
  "Bot", "CircuitBoard", "BatteryCharging", "Wheat", "Fish", "Car",
  "Plane", "Ship", "Home", "School", "Hospital", "Banknote",
];

export default function IconPicker({ value = "Rocket", onChange }) {
  const Selected = Lucide[value] || Lucide.Rocket;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Logo icon
      </label>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
          <Selected size={24} />
        </div>
        <span className="text-sm text-slate-600">{value}</span>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
        {ICON_NAMES.map((name) => {
          const Icon = Lucide[name];
          if (!Icon) return null;
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
              className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
                active
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-600 hover:bg-teal-50 hover:text-teal-700 border border-slate-100"
              }`}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Render a stored lucide icon name */
export function LogoIcon({ name = "Rocket", size = 20, className = "" }) {
  const Icon = Lucide[name] || Lucide.Rocket;
  return <Icon size={size} className={className} />;
}