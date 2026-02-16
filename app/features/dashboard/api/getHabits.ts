import { axiosInstance } from "@/lib/axios";
import type { QueryConfig } from "@/lib/query-client";
import { queryOptions, useQuery } from "@tanstack/react-query";

const getHabits = async () => {
  const res = await axiosInstance.get("/habits");

  return res.data.data;
};

export const getHabitsQueryKey = () => ["habits"];

const getHabitsQueryOptions = () => {
  return queryOptions({
    queryFn: getHabits,
    queryKey: getHabitsQueryKey(),
  });
};

export type UseGetHabitsParams = {
  queryConfig?: QueryConfig<typeof getHabits>;
};

export const useGetHabits = (params: UseGetHabitsParams = {}) => {
  return useQuery({
    ...getHabitsQueryOptions(),
    ...params.queryConfig,
  });
};
