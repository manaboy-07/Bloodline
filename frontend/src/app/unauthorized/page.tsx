"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function UnauthorizedPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

 
  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/auth");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-neutral-950 to-neutral-900 px-4 text-center">
      <div className="relative max-w-md rounded-2xl border border-red-500/20 bg-neutral-900/80 p-8 shadow-2xl shadow-red-500/5 backdrop-blur-sm">
        {/* Decorative icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <ShieldX className="h-10 w-10" />
        </div>

        <h1 className="mb-2 text-3xl font-black text-white">Access Denied</h1>
        <p className="mb-6 text-sm text-neutral-400">
          You don’t have permission to view this page. This area is restricted to
          administrators only.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </button>
        </div>

        {user && (
          <div className="mt-6 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
            Signed in as <span className="font-medium text-neutral-300">{user.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}