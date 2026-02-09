import type { HabitStats } from "../hooks/useHabits";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/types/habit";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface CategoryChartProps {
  stats: HabitStats;
  isPro: boolean;
}

export function CategoryChart({ stats, isPro }: CategoryChartProps) {
  const data = stats.categoryBreakdown.map((item) => ({
    name: item.category,
    value: item.count,
    color: CATEGORY_COLORS[item.category],
    icon: CATEGORY_ICONS[item.category],
  }));

  if (!isPro) {
    return (
      <div className="glass rounded-xl p-6 relative overflow-hidden">
        <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
        <div className="h-48 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Advanced charts available in Pro
            </p>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Upgrade to Pro
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-semibold text-lg mb-4">Category Breakdown</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(
                value: number | undefined,
                name: string | undefined,
              ) => {
                return [
                  `${value} habit${value !== 1 ? "s" : ""}`,
                  `${CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS]} ${name}`,
                ];
              }}
            />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm capitalize">
                  {CATEGORY_ICONS[value as keyof typeof CATEGORY_ICONS]} {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
