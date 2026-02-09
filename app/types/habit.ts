export type Frequency = "daily" | "weekly" | "custom";

export type Category =
  | "health"
  | "fitness"
  | "productivity"
  | "learning"
  | "mindfulness"
  | "social"
  | "finance"
  | "other";

export interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
}

export interface Habit {
  id: string;
  title: string;
  category: Category;
  frequency: Frequency;
  customDays?: number[]; // 0-6 for Sunday-Saturday
  streak: number;
  longestStreak: number;
  history: HabitCompletion[];
  createdAt: string;
  updatedAt: string;
}

export type PlanType = "free" | "pro";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  createdAt: string;
}

export interface PlanLimits {
  maxHabits: number;
  historyDays: number;
  analytics: "basic" | "full";
  exportFormats: ("csv" | "pdf")[];
  advancedCharts: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxHabits: 5,
    historyDays: 7,
    analytics: "basic",
    exportFormats: [],
    advancedCharts: false,
  },
  pro: {
    maxHabits: Infinity,
    historyDays: Infinity,
    analytics: "full",
    exportFormats: ["csv", "pdf"],
    advancedCharts: true,
  },
};

export const CATEGORY_COLORS: Record<Category, string> = {
  health: "hsl(142, 76%, 46%)",
  fitness: "hsl(199, 89%, 48%)",
  productivity: "hsl(174, 72%, 56%)",
  learning: "hsl(262, 83%, 58%)",
  mindfulness: "hsl(316, 72%, 52%)",
  social: "hsl(38, 92%, 50%)",
  finance: "hsl(47, 95%, 53%)",
  other: "hsl(215, 20%, 55%)",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  health: "🏥",
  fitness: "💪",
  productivity: "⚡",
  learning: "📚",
  mindfulness: "🧘",
  social: "👥",
  finance: "💰",
  other: "📌",
};
