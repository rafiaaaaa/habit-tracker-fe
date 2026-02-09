import { useState, useCallback } from "react";
import type { Habit, Category, PlanType } from "@/types/habit";
import { PLAN_LIMITS } from "@/types/habit";

const mockHabits: Habit[] = [
  {
    id: "1",
    title: "Morning Meditation",
    category: "mindfulness",
    frequency: "daily",
    streak: 12,
    longestStreak: 21,
    history: [
      { date: "2026-02-07", completed: true },
      { date: "2026-02-06", completed: true },
      { date: "2026-02-05", completed: true },
      { date: "2026-02-04", completed: false },
      { date: "2026-02-03", completed: true },
    ],
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-02-07T00:00:00Z",
  },
  {
    id: "2",
    title: "Read 30 minutes",
    category: "learning",
    frequency: "daily",
    streak: 5,
    longestStreak: 14,
    history: [
      { date: "2026-02-07", completed: false },
      { date: "2026-02-06", completed: true },
      { date: "2026-02-05", completed: true },
      { date: "2026-02-04", completed: true },
      { date: "2026-02-03", completed: true },
    ],
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-02-07T00:00:00Z",
  },
  {
    id: "3",
    title: "Gym Workout",
    category: "fitness",
    frequency: "weekly",
    customDays: [1, 3, 5], // Mon, Wed, Fri
    streak: 8,
    longestStreak: 8,
    history: [
      { date: "2026-02-07", completed: true },
      { date: "2026-02-05", completed: true },
      { date: "2026-02-03", completed: true },
    ],
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-02-07T00:00:00Z",
  },
  {
    id: "4",
    title: "Drink 8 glasses of water",
    category: "health",
    frequency: "daily",
    streak: 3,
    longestStreak: 10,
    history: [
      { date: "2026-02-07", completed: true },
      { date: "2026-02-06", completed: true },
      { date: "2026-02-05", completed: true },
    ],
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-02-07T00:00:00Z",
  },
];

interface UseHabitsReturn {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "streak" | "longestStreak" | "history" | "createdAt" | "updatedAt"
    >,
  ) => Promise<{ success: boolean; error?: string }>;
  updateHabit: (
    id: string,
    updates: Partial<Habit>,
  ) => Promise<{ success: boolean; error?: string }>;
  deleteHabit: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleHabitCompletion: (
    id: string,
    date: string,
  ) => Promise<{ success: boolean; error?: string }>;
  getHabitStats: () => HabitStats;
  canAddHabit: (plan: PlanType) => boolean;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  pendingToday: number;
  totalStreak: number;
  averageCompletion: number;
  weeklyProgress: { day: string; completed: number; total: number }[];
  categoryBreakdown: {
    category: Category;
    count: number;
    percentage: number;
  }[];
}

export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [isLoading] = useState(false);

  const canAddHabit = useCallback(
    (plan: PlanType) => {
      const limits = PLAN_LIMITS[plan];
      return habits.length < limits.maxHabits;
    },
    [habits.length],
  );

  const addHabit = useCallback(
    async (
      habitData: Omit<
        Habit,
        | "id"
        | "streak"
        | "longestStreak"
        | "history"
        | "createdAt"
        | "updatedAt"
      >,
    ): Promise<{ success: boolean; error?: string }> => {
      const now = new Date().toISOString();
      const newHabit: Habit = {
        ...habitData,
        id: Math.random().toString(36).substr(2, 9),
        streak: 0,
        longestStreak: 0,
        history: [],
        createdAt: now,
        updatedAt: now,
      };

      setHabits((prev) => [...prev, newHabit]);
      return { success: true };
    },
    [],
  );

  const updateHabit = useCallback(
    async (
      id: string,
      updates: Partial<Habit>,
    ): Promise<{ success: boolean; error?: string }> => {
      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === id
            ? { ...habit, ...updates, updatedAt: new Date().toISOString() }
            : habit,
        ),
      );
      return { success: true };
    },
    [],
  );

  const deleteHabit = useCallback(
    async (id: string): Promise<{ success: boolean; error?: string }> => {
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
      return { success: true };
    },
    [],
  );

  const toggleHabitCompletion = useCallback(
    async (
      id: string,
      date: string,
    ): Promise<{ success: boolean; error?: string }> => {
      setHabits((prev) =>
        prev.map((habit) => {
          if (habit.id !== id) return habit;

          const existingIndex = habit.history.findIndex((h) => h.date === date);
          let newHistory = [...habit.history];

          if (existingIndex >= 0) {
            newHistory[existingIndex] = {
              ...newHistory[existingIndex],
              completed: !newHistory[existingIndex].completed,
            };
          } else {
            newHistory.push({ date, completed: true });
          }

          // Sort history by date descending
          newHistory.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          // Recalculate streak
          let streak = 0;
          const today = new Date().toISOString().split("T")[0];
          let currentDate = new Date(today);

          for (let i = 0; i < 365; i++) {
            const dateStr = currentDate.toISOString().split("T")[0];
            const entry = newHistory.find((h) => h.date === dateStr);

            if (entry?.completed) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else if (dateStr === today && !entry?.completed) {
              // Today not completed yet, continue checking
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }

          return {
            ...habit,
            history: newHistory,
            streak,
            longestStreak: Math.max(habit.longestStreak, streak),
            updatedAt: new Date().toISOString(),
          };
        }),
      );

      return { success: true };
    },
    [],
  );

  const getHabitStats = useCallback((): HabitStats => {
    const today = new Date().toISOString().split("T")[0];

    const completedToday = habits.filter((h) =>
      h.history.find((entry) => entry.date === today && entry.completed),
    ).length;

    const pendingToday = habits.length - completedToday;

    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

    // Calculate weekly progress
    const weeklyProgress = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = dayNames[date.getDay()];

      const completed = habits.filter((h) =>
        h.history.find((entry) => entry.date === dateStr && entry.completed),
      ).length;

      weeklyProgress.push({
        day: dayName,
        completed,
        total: habits.length,
      });
    }

    // Calculate category breakdown
    const categoryCount: Record<Category, number> = {} as Record<
      Category,
      number
    >;
    habits.forEach((h) => {
      categoryCount[h.category] = (categoryCount[h.category] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryCount).map(
      ([category, count]) => ({
        category: category as Category,
        count,
        percentage:
          habits.length > 0 ? Math.round((count / habits.length) * 100) : 0,
      }),
    );

    // Calculate average completion rate
    const totalCompletions = habits.reduce((sum, h) => {
      const completed = h.history.filter((entry) => entry.completed).length;
      return sum + completed;
    }, 0);

    const totalPossible = habits.reduce((sum, h) => sum + h.history.length, 0);
    const averageCompletion =
      totalPossible > 0
        ? Math.round((totalCompletions / totalPossible) * 100)
        : 0;

    return {
      totalHabits: habits.length,
      completedToday,
      pendingToday,
      totalStreak,
      averageCompletion,
      weeklyProgress,
      categoryBreakdown,
    };
  }, [habits]);

  return {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStats,
    canAddHabit,
  };
}
