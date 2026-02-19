import { axiosInstance } from "@/lib/axios";
import type { QueryConfig } from "@/lib/query-client";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");

  return res.data.data;
};

const getMeQueryKey = () => ["me"];

const getMeQueryOptions = () => {
  return queryOptions({
    queryKey: getMeQueryKey(),
    queryFn: getMe,
  });
};

type UseGetMeQueryConfig = {
  queryConfig?: QueryConfig<typeof getMe>;
};

export const useGetMe = (params: UseGetMeQueryConfig = {}) => {
  return useQuery({
    ...getMeQueryOptions(),
    ...params.queryConfig,
  });
};
