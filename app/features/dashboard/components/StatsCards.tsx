import type { HabitStats } from "../context/useHabits";
import { Target, CheckCircle, Clock, Flame, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: HabitStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      label: "Total Habits",
      value: stats.totalHabits,
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Pending Today",
      value: stats.pendingToday,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Total Streak",
      value: stats.totalStreak,
      icon: Flame,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Avg. Completion",
      value: `${stats.averageCompletion}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <div key={item.label} className="glass rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold">{item.value}</p>
          <p className="text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
