import type { HabitStats } from "../context/useHabits";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WeeklyChartProps {
  stats: HabitStats;
}

export function WeeklyChart({ stats }: WeeklyChartProps) {
  const data = stats.weeklyProgress.map((day) => ({
    ...day,
    percentage:
      day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">Weekly Progress</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height={192}>
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number | undefined) => [
                `${value}%`,
                "Completion",
              ]}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.percentage >= 80
                      ? "hsl(var(--success))"
                      : entry.percentage >= 50
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
