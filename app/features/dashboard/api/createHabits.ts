import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { getHabitsQueryKey } from "./getHabits";
import z from "zod";

export const createHabitValidationSchema = z.object({
  title: z.string().max(100).min(3),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "CUSTOM"]).default("DAILY"),
  category: z
    .enum([
      "HEALTH",
      "FITNESS",
      "PRODUCTIVITY",
      "LEARNING",
      "MINDFULNESS",
      "SOCIAL",
      "FINANCE",
      "OTHER",
    ])
    .default("HEALTH"),
  color: z.string().optional(),
});

export type CreateHabitRequest = z.infer<typeof createHabitValidationSchema>;

const createHabit = async (params: CreateHabitRequest) => {
  const res = await axiosInstance.post("/habits", params);

  return res.data;
};

type UseCreateHabitParams = {
  mutationConfig?: MutationConfig<typeof createHabit>;
};

export const useCreateHabit = (params: UseCreateHabitParams = {}) => {
  return useMutation({
    mutationFn: createHabit,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getHabitsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
