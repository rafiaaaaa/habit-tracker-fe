import { getMeQueryKey } from "@/api/getMe";
import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const verifySession = async (sessionId: string) => {
  const res = await axiosInstance.post("/payment/verify/session", {
    sessionId,
  });

  return res.data;
};

type UseVerifySessionParams = {
  mutationConfig?: MutationConfig<typeof verifySession>;
};

export const useVerifySession = (params: UseVerifySessionParams = {}) => {
  return useMutation({
    mutationFn: verifySession,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
