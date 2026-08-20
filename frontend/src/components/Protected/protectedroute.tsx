"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || !isAuthenticated) {
      router.replace("/auth");
    }
  }, [hasHydrated, user, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-neutral-950 text-white">
        <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin text-red-400" />
          Checking session...
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}