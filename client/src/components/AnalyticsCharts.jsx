import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#0d9488",
  "#6366f1",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f43f5e",
];

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

export default function AnalyticsCharts({ charts }) {
  if (!charts) return null;

  const {
    statusChart = [],
    sectorChart = [],
    countryChart = [],
    usersByRole = [],
    applicationsOverTime = [],
    opportunityByStatus = [],
    builderByType = [],
    builderByStatus = [],
  } = charts;

  const roleData = usersByRole.filter((d) => d.value > 0);
  const statusData = statusChart.filter((d) => d.value > 0);
  const sectorData = sectorChart.filter((d) => d.value > 0);
  const countryData = countryChart.filter((d) => d.value > 0);
  const oppData = opportunityByStatus.filter((d) => d.value > 0);
  const builderTypeData = builderByType.filter((d) => d.value > 0);
  const builderStatusData = builderByStatus.filter((d) => d.value > 0);

  return (
    <div className="grid lg:grid-cols-2 gap-4 mb-8">
      <ChartCard title="Users by role">
        {roleData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roleData} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Users" fill="#0d9488" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Startups by status">
        {statusData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Startups by sector">
        {sectorData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Startups" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Startups by country">
        {countryData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Startups" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Applications (last months)">
        {applicationsOverTime.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={applicationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="Applications" stroke="#0d9488" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Ecosystem builders by type">
        {builderTypeData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={builderTypeData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" name="Builders" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Ecosystem builders by status">
        {builderStatusData.length === 0 ? (
          <p className="text-sm text-slate-500 text-center pt-20">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={builderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {builderStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {oppData.length > 0 && (
        <ChartCard title="Opportunities by status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={oppData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {oppData.map((_, i) => (
                  <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}