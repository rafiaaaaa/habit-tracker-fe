import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");

  return res.data;
};

type UseLogoutParams = {
  mutationConfig?: MutationConfig<typeof logout>;
};

export const useLogout = (params: UseLogoutParams = {}) => {
  return useMutation({
    mutationFn: logout,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context,
      );
    },
  });
};
