import { axiosInstance } from "@/lib/axios";
import type { MutationConfig } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const createPaymentLink = async () => {
  const res = await axiosInstance.post("/payment");

  return res.data.data;
};

type UseCreatePaymentLinkParams = {
  mutationConfig?: MutationConfig<typeof createPaymentLink>;
};

export const useCreatePaymentLink = (
  params: UseCreatePaymentLinkParams = {},
) => {
  return useMutation({
    mutationFn: createPaymentLink,
    ...params.mutationConfig,
  });
};
