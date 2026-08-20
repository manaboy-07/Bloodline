"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Bell, Flame, Search } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
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
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <p>Loading...</p>;
  }
  
  // if (!isAuthenticated) {
  //   return <p>Please login first.</p>;
  // }

  useGSAP(
    () => {
      gsap.from(".topbar-item", {
        opacity: 0,
        y: -12,
        stagger: 0.04,
        duration: 0.45,
        ease: "power3.out",
      });

      gsap.from(".page-content", {
        opacity: 0,
        y: 12,
        duration: 0.55,
        delay: 0.08,
        ease: "power3.out",
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="flex h-svh w-full min-w-0 flex-col overflow-hidden bg-neutral-950 text-white"
    >
      <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="topbar-item flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:border-red-500/30 hover:bg-neutral-800">
            <SidebarTrigger className="h-6 w-6 text-neutral-400" />
          </div>

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
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="topbar-item hidden items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 transition-colors focus-within:border-red-500/50 lg:flex">
            <Search className="h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search matches..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-neutral-600"
            />
          </div>

          <button className="topbar-item relative flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:border-red-500/30 hover:bg-neutral-800">
            <span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-neutral-950" />
            <Bell className="h-5 w-5 text-neutral-300" />
          </button>

          <div className="topbar-item flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
            <div className="relative">
              <img
                src="https://assets.aceternity.com/manu.png"
                alt="profile"
                className="h-8 w-8 rounded-lg border border-red-500/20 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-neutral-900 bg-emerald-500" />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold">{user?.name}</p>
              <p className="text-[10px] font-medium uppercase tracking-tight text-neutral-500">
                Elite Predictor
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="page-content min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-neutral-950 p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
