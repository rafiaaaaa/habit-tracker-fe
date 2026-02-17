import {
  useState,
  useCallback,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import type { Habit, Category, PlanType } from "@/types/habit";
import { PLAN_LIMITS } from "@/types/habit";
import { getHabitsQueryKey, useGetHabits } from "../api/getHabits";
import { useToggleCompleteHabit } from "../api/toggleCompleteHabit";
import queryClient from "@/lib/query-client";
import { useCreateHabit, type CreateHabitRequest } from "../api/createHabits";
import { useDeleteHabit } from "../api/deleteHabit";

interface HabitContextValue {
  habits: Habit[];
  isLoading: boolean;
  isHabitsLoading: boolean;
  canAddHabit: (plan: PlanType) => boolean;
  toggleHabitCompletion: (habitId: string) => void;
  isToggleCompleteHabitLoading: boolean;
  createHabit: (params: CreateHabitRequest) => void;
  isCreateHabitLoading: boolean;
  habitDialog: "create" | "edit" | null;
  setHabitDialog: (dialog: "create" | "edit" | null) => void;
  deleteHabit: (habitId: string) => void;
  isDeleteHabitLoading: boolean;
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

export const HabitContext = createContext<HabitContextValue | null>(null);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [isLoading] = useState(false);
  const [habitDialog, setHabitDialog] = useState<"create" | "edit" | null>(
    null,
  );

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

  // create
  const { mutate: createHabitMutation, isPending: isCreateHabitLoading } =
    useCreateHabit();

  // delete
  const { mutate: deleteHabitMutation, isPending: isDeleteHabitLoading } =
    useDeleteHabit();

  const canAddHabit = useCallback(
    (plan: PlanType) => {
      const limits = PLAN_LIMITS[plan];
      return habits.length < limits.maxHabits;
    },
    [habits.length],
  );

  const createHabit = (params: CreateHabitRequest) => {
    createHabitMutation(params);
  };

  const deleteHabit = (habitId: string) => {
    deleteHabitMutation(habitId);
  };

  const toggleHabitCompletion = (habitId: string) => {
    toggleCompleteHabitMutation(habitId);
  };

  const value: HabitContextValue = {
    habits,
    isHabitsLoading,
    isLoading,
    canAddHabit,
    toggleHabitCompletion,
    isToggleCompleteHabitLoading,
    createHabit,
    isCreateHabitLoading,
    habitDialog,
    setHabitDialog,
    deleteHabit,
    isDeleteHabitLoading,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);

  if (!context) {
    throw new Error("useHabit must be used within HabitProvider");
  }

  return context;
}
