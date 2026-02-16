import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { getHabitsQueryKey } from "./getHabits";

const toggleCompleteHabit = async (habitId: string) => {
  const res = await axiosInstance.put("/habits/" + habitId);

  return res.data;
};

type UseToggleCompleteHabitParams = {
  mutationConfig?: MutationConfig<typeof toggleCompleteHabit>;
};

export const useToggleCompleteHabit = (
  params: UseToggleCompleteHabitParams = {},
) => {
  return useMutation({
    mutationFn: toggleCompleteHabit,
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
