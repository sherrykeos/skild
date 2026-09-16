"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/common/loading-state";

export default function PlatformTelemetryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex h-96 items-center justify-center">
      <LoadingState message="Redirecting to Admin Console..." />
    </div>
  );
}
