import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const createSubscription = async (params: { plan: string }) => {
  const res = await axiosInstance.post("/subscription", params);

  return res.data;
};

type UseCreateSubscriptionParams = {
  mutationConfig?: MutationConfig<typeof createSubscription>;
};

export const useCreateSubscription = (
  params: UseCreateSubscriptionParams = {},
) => {
  return useMutation({
    mutationFn: createSubscription,
    ...params.mutationConfig,
  });
};
