import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RoundMetrics } from "@/hooks/useSimulationEngine";

interface LiveAnalyticsProps {
  metrics: RoundMetrics[];
}

export function LiveAnalytics({ metrics }: LiveAnalyticsProps) {
  const chartData = metrics.map((m) => ({
    round: `R${m.round}`,
    accuracy: parseFloat((m.globalAccuracy * 100).toFixed(1)),
    loss: parseFloat(m.globalLoss.toFixed(4)),
  }));

  return (
    <div className="glass-card p-5 space-y-4">
      <h3 className="text-sm font-semibold">Live Analytics</h3>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[180px] text-xs text-muted-foreground">
          Start simulation to see live metrics
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accuracy Chart */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Global Accuracy (%)</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Loss Chart */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Global Loss</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="round" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="loss"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
