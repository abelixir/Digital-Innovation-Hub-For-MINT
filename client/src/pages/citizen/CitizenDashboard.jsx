import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../components/AppShell";
import { Building2, ArrowRight, Megaphone } from "lucide-react";

export default function CitizenDashboard() {
  const { user } = useAuth();

  const features = [
    {
      title: "Designated startups",
      description: "Explore startups designated by MinT across Ethiopia.",
      icon: Building2,
      to: "/directory",
      color: "bg-teal-50 text-teal-700",
    },
    {
      title: "Opportunities",
      description: "Jobs, internships, scholarships and official announcements.",
      icon: Megaphone,
      to: "/opportunities",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <AppShell
      title="Citizen portal"
      subtitle={`Welcome, ${user?.fullName?.split(" ")[0] || "Citizen"}`}
    >
      <p className="text-slate-600 mb-8 max-w-2xl">
        Explore Ethiopia&apos;s innovation ecosystem, discover opportunities, and
        stay connected with designated startups.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
            >
              <item.icon size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-teal-800">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{item.description}</p>
            <div className="flex items-center text-sm font-medium text-teal-700">
              Explore
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}