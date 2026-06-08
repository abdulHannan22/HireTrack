import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const STATUS_COLORS = {
  wishlist:  "#4b5563",   // gray-600
  applied:   "#3b82f6",   // blue-500
  screening: "#f59e0b",   // amber-500
  interview: "#10b981",   // emerald-500
  offer:     "#a855f7",   // purple-500
  rejected:  "#ef4444",   // red-500
};

const LABEL = {
  wishlist:  "Wishlist",
  applied:   "Applied",
  screening: "Screening",
  interview: "Interview",
  offer:     "Offer",
  rejected:  "Rejected",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-0.5">{LABEL[name] ?? name}</p>
      <p className="text-white font-semibold text-sm">
        {value} application{value !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function SkeletonBar() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="h-3 w-36 bg-gray-800 rounded mb-1" />
      <div className="h-3 w-24 bg-gray-800/60 rounded mb-6" />
      <div className="flex items-end gap-3 h-40">
        {[60, 100, 75, 90, 40, 55].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-800 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function StatusBarChart({ stats, loading }) {
  if (loading) return <SkeletonBar />;

  const data = Object.entries(stats?.byStatus ?? {}).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((s, d) => s + d.value, 0);
  const hasData = total > 0;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-gray-200">Applications by status</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {total} total across {data.filter((d) => d.value > 0).length} stages
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-gray-700 text-sm">No data yet</p>
          <p className="text-gray-800 text-xs mt-1">Add applications to see your pipeline</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={32} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#1f2937" strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#4b5563" }}
              tickFormatter={(v) => LABEL[v] ?? v}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#4b5563" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff08" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={STATUS_COLORS[entry.name] ?? "#4b5563"}
                  opacity={entry.value === 0 ? 0.2 : 1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
