import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
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
  });
};
