import { useState, useCallback } from "react";
import type { Habit, Category, PlanType } from "@/types/habit";
import { PLAN_LIMITS } from "@/types/habit";
import { getHabitsQueryKey, useGetHabits } from "../api/getHabits";
import { useToggleCompleteHabit } from "../api/toggleCompleteHabit";
import queryClient from "@/lib/query-client";

const mockHabits: Habit[] = [
  {
    id: "1",
    title: "Morning Meditation",
    category: "mindfulness",
    frequency: "daily",
    streak: 12,
    longestStreak: 21,
    habitRecords: {
      "2026-02-07": true,
    },
    todayCompleted: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-02-07T00:00:00Z",
  },
];

interface UseHabitsReturn {
  habits: Habit[];
  isLoading: boolean;
  isHabitsLoading: boolean;
  canAddHabit: (plan: PlanType) => boolean;
  toggleHabitCompletion: (habitId: string) => void;
  isToggleCompleteHabitLoading: boolean;
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
  const [isLoading] = useState(false);

  const {
    data: habits = [],
    isPending: isHabitsLoading,
    error,
  } = useGetHabits();

  const {
    mutate: toggleCompleteHabitMutation,
    isPending: isToggleCompleteHabitLoading,
  } = useToggleCompleteHabit({
    mutationConfig: {
      onMutate: async (habitId: string) => {
        const today = new Date().toISOString().split("T")[0];

        queryClient.setQueryData(getHabitsQueryKey(), (old: Habit[]) => {
          if (!old) return old;

          return old.map((habit) => {
            if (habit.id !== habitId) return habit;

            const isCompleteToday = habit.habitRecords?.[today] ?? false;

            return {
              ...habit,
              habitRecords: {
                ...habit.habitRecords,
                [today]: !isCompleteToday,
              },
            };
          });
        });
      },
    },
  });

  const canAddHabit = useCallback(
    (plan: PlanType) => {
      const limits = PLAN_LIMITS[plan];
      return habits.length < limits.maxHabits;
    },
    [habits.length],
  );

  const toggleHabitCompletion = (habitId: string) => {
    toggleCompleteHabitMutation(habitId);
  };

  return {
    habits,
    isHabitsLoading,
    isLoading,
    canAddHabit,
    toggleHabitCompletion,
    isToggleCompleteHabitLoading,
  };
}
