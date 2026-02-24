import { getMeQueryKey } from "@/api/getMe";
import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

export const loginGoogle = async (idToken: string) => {
  const res = await axiosInstance.post("/auth/google", { idToken });

  return res.data;
};

type UseLoginGoogleParams = {
  mutationConfig?: MutationConfig<typeof loginGoogle>;
};

export const useLoginGoogle = (params: UseLoginGoogleParams = {}) => {
  return useMutation({
    mutationFn: loginGoogle,
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
