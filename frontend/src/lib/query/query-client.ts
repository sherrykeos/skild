import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes cache validity
        gcTime: 1000 * 60 * 10, // 10 minutes garbage collection time
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          if (error?.statusCode === 404 || error?.statusCode === 401 || error?.statusCode === 403) {
            return false;
          }
          return failureCount < 2;
        },
      },
    },
  });
}
