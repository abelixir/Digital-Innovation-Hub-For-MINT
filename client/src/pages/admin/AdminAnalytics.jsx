import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import AnalyticsCharts from "../../components/AnalyticsCharts";
import {
  Building2,
  CheckCircle,
  Users,
  Loader2,
  Inbox,
  Network,
  AlertTriangle,
} from "lucide-react";

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest("/startups/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <AppShell title="Analytics">
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Analytics"
      subtitle={`Ecosystem overview · ${user?.fullName || "Admin"}`}
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total startups" value={stats?.totalStartups ?? 0} icon={Building2} color="blue" />
        <StatCard label="Designated startups" value={stats?.verified ?? 0} icon={CheckCircle} color="teal" />
        <StatCard label="Startup queue" value={stats?.pending ?? 0} icon={Inbox} color="amber" />
        <StatCard label="Overdue reviews" value={stats?.overdue ?? 0} icon={AlertTriangle} color="red" />
        <StatCard label="Investors" value={stats?.totalInvestors ?? 0} icon={Users} color="purple" />
        <StatCard label="Founders" value={stats?.totalFounders ?? 0} icon={Users} color="blue" />
        <StatCard label="Ecosystem builders" value={stats?.totalBuilders ?? 0} icon={Network} color="teal" />
        <StatCard label="Designated builders" value={stats?.designatedBuilders ?? 0} icon={CheckCircle} color="purple" />
      </div>

      <AnalyticsCharts charts={stats?.charts} />
    </AppShell>
  );
}