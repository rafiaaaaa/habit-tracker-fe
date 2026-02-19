import { QueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ApiError {
  success: boolean;
  message: string;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Kapan perlu refresh data
      staleTime: 5 * 60 * 1000,
      // Seberapa lama data di cache
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          error instanceof AxiosError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 0;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: () => {
        alert("Something went wrong");
      },
    },
  },
});

export type ApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type QueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>,
  AxiosError<ApiError>,
  Parameters<MutationFnType>[0]
>;

export default queryClient;
