"use client";

import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query/query-client";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#141916",
              border: "1px solid #252D28",
              color: "#F1F4EF",
              fontFamily: "var(--font-sans)",
            },
            className: "border border-[#252D28] bg-[#141916] text-[#F1F4EF] shadow-2xl",
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
