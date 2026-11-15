"use client";

import { useEffect } from "react";
import { profileDetail } from "@/api/services/user";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthInitializer() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !user) return;

    profileDetail().catch(() => {
      // The Axios interceptor handles 401 responses.
      // Don't log out on temporary network errors.
    });
  }, [hasHydrated, user?.id]);

  return null;
}
