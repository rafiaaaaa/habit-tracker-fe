import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { getHabitsQueryKey } from "./getHabits";

const deleteHabit = async (habitId: string) => {
  const res = await axiosInstance.delete(`/habits/${habitId}`);

  return res.data;
};

type UseDeleteHabitParams = {
  mutationConfig?: MutationConfig<typeof deleteHabit>;
};

export const useDeleteHabit = (params: UseDeleteHabitParams = {}) => {
  return useMutation({
    mutationFn: deleteHabit,
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
