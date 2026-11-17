"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Bell, Flame, Search } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

gsap.registerPlugin(useGSAP);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
<<<<<<< HEAD
=======

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }
>>>>>>> 1f494ce3cfa6d8d9607f23c4c78d6e379f7c1ca1

  // Always call useGSAP, regardless of hydration state.
  useGSAP(
    () => {
      if (!hasHydrated) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const context = gsap.context(() => {
        gsap.from(".topbar-item", {
          opacity: 0,
          y: -10,
          stagger: 0.05,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.from(".page-content", {
          opacity: 0,
          y: 10,
          duration: 0.45,
          delay: 0.08,
          ease: "power2.out",
        });
      }, container);

      return () => context.revert();
    },
    {
      scope: container,
      dependencies: [hasHydrated],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={container}
      className="flex w-full min-w-0 flex-col bg-neutral-950 text-white"
    >
<<<<<<< HEAD
      {!hasHydrated ? (
        <main className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-neutral-500">Loading dashboard...</p>
        </main>
      ) : (
        <>
          <header className="sticky top-12 z-40 flex h-20 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-4 sm:px-6">
            <div className="topbar-item min-w-0">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 shrink-0 text-red-500" />

                <h1 className="truncate text-xl font-bold uppercase tracking-tight">
                  Dashboard
                </h1>
              </div>
=======
      <header className="sticky top-12 z-40 flex h-20 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="topbar-item min-w-0">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 shrink-0 text-red-500" />
            <h1 className="truncate text-xl font-black uppercase tracking-tight">
              Dashboard
            </h1>
          </div>
          <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Welcome to Bloodline
          </p>
        </div>
>>>>>>> 1f494ce3cfa6d8d9607f23c4c78d6e379f7c1ca1

              <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-widest text-neutral-500">
                Welcome to Bloodline
              </p>
            </div>

<<<<<<< HEAD
            <div className="flex shrink-0 items-center gap-3">
              <div className="topbar-item hidden items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 transition-colors focus-within:border-red-500/50 lg:flex">
                <Search className="h-4 w-4 text-neutral-500" />

                <input
                  type="text"
                  placeholder="Search matches..."
                  className="w-48 bg-transparent text-sm text-white outline-none placeholder:text-neutral-600"
                />
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="topbar-item relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 transition-colors hover:border-neutral-700 hover:bg-neutral-800"
              >
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
                <Bell className="h-5 w-5 text-neutral-300" />
              </button>

              <div className="topbar-item flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5">
                <div className="relative">
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    alt="Profile"
                    className="h-8 w-8 rounded-md border border-neutral-700 object-cover"
                  />

                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-neutral-900 bg-emerald-500" />
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-semibold">
                    {user?.name ?? "Predictor"}
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-tight text-neutral-500">
                    Elite Predictor
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="page-content min-w-0 flex-1 bg-neutral-950 p-4 sm:p-6">
            {children}
          </main>
        </>
      )}
=======
      <main className="page-content min-w-0 flex-1 bg-neutral-950 p-4 sm:p-6">
        {children}
      </main>
>>>>>>> 1f494ce3cfa6d8d9607f23c4c78d6e379f7c1ca1
    </div>
  );
}
