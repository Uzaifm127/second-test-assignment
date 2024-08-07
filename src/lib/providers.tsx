"use client";

import { ContextProvider } from "@/context/app-context";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     // This is to prevent the immediate refetch in SSR.
  //     staleTime: 60 * 1000,
  //   },
  // },
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>{children}</ContextProvider>
    </QueryClientProvider>
  );
};

export default Providers;
