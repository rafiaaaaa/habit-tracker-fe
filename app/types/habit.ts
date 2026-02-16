export type Frequency = "DAILY" | "WEEKLY" | "CUSTOM";

export type Category =
  | "HEALTH"
  | "FITNESS"
  | "PRODUCTIVITY"
  | "LEARNING"
  | "MINDFULNESS"
  | "SOCIAL"
  | "FINANCE"
  | "OTHER";

export interface Habit {
  id: string;
  title: string;
  category: Category;
  frequency: Frequency;
  customDays?: number[]; // 0-6 for Sunday-Saturday
  streak: number;
  longestStreak: number;
  habitRecords: Record<string, boolean>;
  todayCompleted: boolean;
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
  HEALTH: "hsl(142, 76%, 46%)",
  FITNESS: "hsl(199, 89%, 48%)",
  PRODUCTIVITY: "hsl(174, 72%, 56%)",
  LEARNING: "hsl(262, 83%, 58%)",
  MINDFULNESS: "hsl(316, 72%, 52%)",
  SOCIAL: "hsl(38, 92%, 50%)",
  FINANCE: "hsl(47, 95%, 53%)",
  OTHER: "hsl(215, 20%, 55%)",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  HEALTH: "🏥",
  FITNESS: "💪",
  PRODUCTIVITY: "⚡",
  LEARNING: "📚",
  MINDFULNESS: "🧘",
  SOCIAL: "👥",
  FINANCE: "💰",
  OTHER: "📌",
};
