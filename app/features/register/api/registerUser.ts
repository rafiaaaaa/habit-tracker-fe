import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string().max(100).min(3, "Name must be at least 3 characters"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;

export const registerUser = async (params: RegisterUserSchema) => {
  const response = await axiosInstance.post("/auth/register", params);

  return response.data;
};

type UseRegisterUserParams = {
  mutationConfig?: MutationConfig<typeof registerUser>;
};

export const useRegisterUser = (params: UseRegisterUserParams = {}) => {
  return useMutation({
    mutationFn: registerUser,
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
