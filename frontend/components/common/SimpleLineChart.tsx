import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SimpleLineChartProps {
  data: { name: string; value: number }[];
}

export function SimpleLineChart({ data }: SimpleLineChartProps) {
  return (
    <div className="h-64 rounded-xl border border-white/10 bg-white/5 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(148,163,184,0.4)",
              color: "#e5e7eb",
            }}
          />
          <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


