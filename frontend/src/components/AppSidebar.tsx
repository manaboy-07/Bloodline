"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import {
  IconArrowLeft,
  IconBallFootball,
  IconBrandTabler,
  IconCalendarStats,
  IconSettings,
  IconTrophy,
  IconUserBolt,
} from "@tabler/icons-react";

import { Flame } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

gsap.registerPlugin(useGSAP);

const links = [
  {
    title: "Dashboard",
    href: "/",
    icon: IconBrandTabler,
  },
  {
    title: "Matches",
    href: "/matches",
    icon: IconCalendarStats,
  },
  {
    title: "Predictions",
    href: "/predictions",
    icon: IconBallFootball,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: IconTrophy,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: IconUserBolt,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: IconSettings,
  },
];

export function AppSidebar() {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.5,
        },
      });

      gsap.set(".sidebar-animate", {
        autoAlpha: 0,
        y: 12,
        force3D: true,
      });

      gsap.set(".sidebar-nav-item", {
        autoAlpha: 0,
        x: -14,
        force3D: true,
      });

      tl.to(".sidebar-animate", {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
      }).to(
        ".sidebar-nav-item",
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.05,
        },
        "-=0.25",
      );

      return () => {
        tl.kill();
      };
    },
    { scope: container },
  );

  return (
    <Sidebar
      ref={container}
      className="border-r border-neutral-800 bg-neutral-950 text-white"
    >
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />

      <SidebarContent className="relative z-10 bg-neutral-950 px-3 py-5">
        <Link
          href="/"
          className="sidebar-animate mb-8 flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-neutral-900/70"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-950 shadow-[0_0_28px_rgba(220,38,38,0.28)]">
            <Flame className="h-5 w-5 text-white" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-black tracking-tight">
              Bloodline
            </h1>
            <p className="truncate text-xs font-medium text-neutral-500">
              Prediction League
            </p>
          </div>
        </Link>

        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-animate mb-3 bg-transparent px-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
            Navigation
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1.5 bg-transparent">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.title}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "sidebar-nav-item group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition",
                      isActive
                        ? "bg-red-500/10 text-white ring-1 ring-red-500/20"
                        : "text-neutral-400 hover:bg-neutral-900 hover:text-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
                        isActive
                          ? "bg-red-500/15 text-red-400"
                          : "bg-neutral-900 text-neutral-500 group-hover:bg-red-500/10 group-hover:text-red-400",
                      ].join(" ")}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="truncate">{item.title}</span>

                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]" />
                    )}
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="sidebar-animate border-t border-neutral-800 bg-neutral-950 p-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
          <div className="flex items-center gap-3">
            <img
              src="https://assets.aceternity.com/manu.png"
              className="h-10 w-10 shrink-0 rounded-lg border border-red-500/25 object-cover"
              alt="Manasseh"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">Manasseh</p>
              <p className="truncate text-xs text-neutral-500">
                Elite Predictor
              </p>
            </div>

            <button
              type="button"
              aria-label="Log out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <IconArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
