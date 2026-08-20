"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, CalendarDays, Target, Trophy } from "lucide-react";

import PlayerList from "./PlayerList";
import Winner from "./Winner";

gsap.registerPlugin(useGSAP);

const stats = [
  {
    label: "Upcoming Matches",
    value: "12",
    href: "/matches",
    action: "Make prediction",
    icon: CalendarDays,
    color: "blue",
  },
  {
    label: "Weekly Points",
    value: "20",
    helper: "+8 points from last week",
    icon: Target,
    color: "emerald",
  },
  {
    label: "Overall Points",
    value: "86",
    helper: "Top 10% globally",
    icon: Trophy,
    color: "amber",
  },
];

export default function Dashboard() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(".dashboard-animate", { autoAlpha: 1, y: 0, x: 0 });
        return;
      }

      gsap.set(".dashboard-animate", {
        autoAlpha: 0,
        y: 18,
        force3D: true,
      });

      gsap.set(".hero-rank", {
        autoAlpha: 0,
        x: 24,
        force3D: true,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.55,
        },
      });

      tl.to(".hero-panel", { autoAlpha: 1, y: 0, duration: 0.65 })
        .to(".hero-copy", { autoAlpha: 1, y: 0, stagger: 0.08 }, "-=0.35")
        .to(".hero-rank", { autoAlpha: 1, x: 0, duration: 0.6 }, "-=0.35")
        .to(".stat-card", { autoAlpha: 1, y: 0, stagger: 0.08 }, "-=0.2")
        .to(
          ".dashboard-section",
          { autoAlpha: 1, y: 0, stagger: 0.1 },
          "-=0.2",
        );

      return () => {
        tl.kill();
      };
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-5 bg-neutral-950 text-white"
    >
      <section className="hero-panel dashboard-animate relative overflow-hidden rounded-xl border border-neutral-800 bg-[linear-gradient(135deg,#171717_0%,#0a0a0a_48%,rgba(127,29,29,0.45)_100%)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:p-6 lg:p-8">
        <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-red-500/60 via-neutral-700 to-transparent" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div className="min-w-0">
            <p className="hero-copy dashboard-animate mb-3 text-xs font-bold uppercase tracking-[0.28em] text-red-400">
              Bloodline Predictions
            </p>

            <h1 className="hero-copy dashboard-animate max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              Predict. <span className="text-red-500">Compete.</span>
              <br className="hidden sm:block" />
              Dominate the leaderboard.
            </h1>

            <p className="hero-copy dashboard-animate mt-4 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
              Track upcoming fixtures, lock in your scorelines, earn points, and
              climb the Bloodline rankings before the week closes.
            </p>

            <div className="hero-copy dashboard-animate mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/matches"
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold transition hover:bg-red-500 sm:w-auto"
              >
                Predict Matches
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/leaderboard"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 px-5 text-sm font-bold text-neutral-300 transition hover:border-red-500/40 hover:text-white sm:w-auto"
              >
                View Rankings
              </Link>
            </div>
          </div>

          <div className="hero-rank rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur lg:p-6">
            <p className="text-sm text-neutral-400">Current Position</p>
            <div className="mt-3 flex items-end gap-3">
              <h2 className="text-6xl font-black leading-none text-red-500">
                #4
              </h2>
              <span className="pb-2 text-sm font-bold text-emerald-400">
                +2 today
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Only 12 points behind the leader. One perfect prediction can flip
              the table.
            </p>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="stat-card dashboard-animate rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition hover:-translate-y-1 hover:border-neutral-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm text-neutral-400">
                    {stat.label}
                  </p>
                  <h2 className="mt-3 text-4xl font-black">{stat.value}</h2>
                </div>

                <div
                  className={[
                    "rounded-lg p-3",
                    stat.color === "blue" && "bg-blue-500/10 text-blue-400",
                    stat.color === "emerald" &&
                      "bg-emerald-500/10 text-emerald-400",
                    stat.color === "amber" && "bg-amber-500/10 text-amber-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              {stat.href ? (
                <Link
                  href={stat.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition hover:text-blue-300"
                >
                  {stat.action}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <p className="mt-5 text-sm text-neutral-500">{stat.helper}</p>
              )}
            </div>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <div className="dashboard-section dashboard-animate min-w-0 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Top Predictors
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Weekly leaderboard standings
              </p>
            </div>

            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-400 transition hover:text-red-300"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <PlayerList isShortList={true} />
        </div>

        <div className="dashboard-section dashboard-animate min-w-0 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
          <Winner />
        </div>
      </section>
    </div>
  );
}
