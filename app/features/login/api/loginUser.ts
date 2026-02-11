import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginUserSchema = z.infer<typeof loginUserSchema>;

export const loginUser = async (payload: LoginUserSchema) => {
  const response = await axiosInstance.post("/auth/login", payload);

  return response.data;
};

type UseLoginUserParams = {
  mutationConfig?: MutationConfig<typeof loginUser>;
};

export const useLoginUser = (params: UseLoginUserParams = {}) => {
  return useMutation({
    mutationFn: loginUser,
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
