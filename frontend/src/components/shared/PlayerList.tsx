"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Crown,
  Medal,
  ShieldCheck,
  ChevronUp,
  ArrowRight,
  Trophy,
  Mail,
  User,
} from "lucide-react";
import { getLeaderboard } from "@/api/services/user";
import { LeaderboardEntry } from "@/mockusers"; 
const rankStyles = [
  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "bg-neutral-700/50 text-neutral-300 border-neutral-600/30",
  "bg-amber-500/20 text-amber-500 border-amber-500/30",
];

const getTopThreeUsers = (users: LeaderboardEntry[]) => users.slice(0, 3);

type LeaderboardProps = {
  isShortList: boolean;
};

// Skeleton loader component
const SkeletonRow = () => (
  <div className="animate-pulse grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3 sm:gap-4">
    <div className="h-9 w-9 rounded-lg bg-neutral-800" />
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-neutral-800" />
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-neutral-800" />
        <div className="h-3 w-16 rounded bg-neutral-800" />
      </div>
    </div>
    <div className="h-8 w-16 rounded-lg bg-neutral-800" />
  </div>
);

export default function PlayerList({ isShortList }: LeaderboardProps) {
  const [list, setList] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  
  const playerslist = useMemo(() => {
    if (isShortList) return getTopThreeUsers(list);
    return list;
  }, [list, isShortList]);

  
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeaderboard();
        if (isMounted) setList(data);
      } catch (err) {
        if (isMounted) {
          setError("Couldn't load leaderboard. Please refresh.");
          console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, []);

  
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set(".leaderboard-item", { autoAlpha: 1, y: 0 });
        return;
      }

      const tl = gsap.fromTo(
        ".leaderboard-item",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: {
            each: isShortList ? 0.08 : 0.04,
            amount: isShortList ? 0.25 : 0.5,
          },
          clearProps: "opacity,transform",
        }
      );

      return () => tl.kill();
    },
    { scope: containerRef, dependencies: [playerslist, isShortList] }
  );

  const getRankIcon = useCallback((position: number) => {
    const icons = [Crown, Medal, ShieldCheck];
    if (position <= 3) {
      const Icon = icons[position - 1];
      return (
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${rankStyles[position - 1]} shadow-lg`}
        >
          <Icon className="h-[20px] w-[20px]" />
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-800/60 text-sm font-black text-neutral-400 border border-neutral-700/50">
        #{position}
      </div>
    );
  }, []);

  // Loading state with skeletons
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={isShortList ? "w-full" : "w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5"}
      >
        {!isShortList && (
          <div className="mb-5 flex items-center justify-between border-b border-neutral-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-xl bg-neutral-800" />
              <div>
                <div className="h-6 w-40 animate-pulse rounded bg-neutral-800" />
                <div className="mt-1 h-4 w-32 animate-pulse rounded bg-neutral-800" />
              </div>
            </div>
            <div className="h-10 w-28 animate-pulse rounded-lg bg-neutral-800" />
          </div>
        )}
        <div className="space-y-3">
          {[...Array(isShortList ? 3 : 6)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400 backdrop-blur-sm">
        <p className="font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 inline-block rounded-lg bg-red-500/20 px-4 py-2 text-sm font-bold hover:bg-red-500/30 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={
        isShortList
          ? "w-full min-w-0"
          : "w-full min-w-0 rounded-2xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-4 shadow-2xl backdrop-blur-sm sm:p-5"
      }
    >
      {/* Header for full list */}
      {!isShortList && (
        <div className="leaderboard-item mb-6 flex flex-col gap-3 border-b border-neutral-800/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-rose-600/20 text-red-400 shadow-lg shadow-red-500/10">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Leaderboard
              </h1>
              <p className="text-sm text-neutral-400">
                Top predictors for this week
              </p>
            </div>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400 shadow-lg shadow-emerald-500/5">
            <ChevronUp className="h-4 w-4" />
            Competitive
          </div>
        </div>
      )}

      {/* Player list */}
      <div className={isShortList ? "space-y-3" : "space-y-2.5"}>
        {playerslist.map((user, idx) => {
          const position = idx + 1;
          const isTop = position <= 3;

          return (
            <div
              key={user.id || user.email}
              className={`
                leaderboard-item group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 
                rounded-xl border transition-all duration-200 
                ${isTop 
                  ? "border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent hover:border-yellow-500/40" 
                  : "border-neutral-800/60 bg-neutral-950/40 hover:border-red-500/30 hover:bg-neutral-950/70"
                }
                ${isShortList ? "p-3 sm:p-4" : "p-3"}
                hover:-translate-y-0.5 hover:shadow-xl
              `}
            >
              {getRankIcon(position)}

              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar with gradient */}
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-lg 
                    bg-gradient-to-br from-red-500 to-rose-700 text-sm font-black text-white 
                    shadow-lg shadow-red-500/20
                    ${isTop ? "ring-2 ring-yellow-500/40 ring-offset-1 ring-offset-neutral-950" : ""}
                  `}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white group-hover:text-red-300 transition">
                    {user.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-400">
                    <span className="truncate">{user.club || "Independent"}</span>
                    <span className="hidden h-1 w-1 rounded-full bg-neutral-600 sm:block" />
                    <span className="hidden sm:inline">Elite Predictor</span>
                    {/* Email – shown on hover or always as subtle */}
                    <span className="inline-flex items-center gap-1 text-neutral-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[100px] sm:max-w-[150px]">
                        {user.email}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`
                    rounded-lg px-2.5 py-1.5 text-xs font-black 
                    ${isTop 
                      ? "bg-yellow-500/20 text-yellow-400" 
                      : "bg-red-500/10 text-red-400"
                    }
                    sm:px-3
                  `}
                >
                  {user.points} pts
                </span>
                <ArrowRight
                  className={`
                    hidden h-4 w-4 transition group-hover:translate-x-0.5 
                    ${isTop ? "text-yellow-500/50 group-hover:text-yellow-400" : "text-neutral-600 group-hover:text-red-400"}
                    sm:block
                  `}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer for full list */}
      {!isShortList && (
        <div className="leaderboard-item mt-5 flex items-center justify-between gap-3 rounded-xl border border-neutral-800/60 bg-neutral-950/60 px-4 py-3 text-sm backdrop-blur-sm">
          <span className="font-bold text-neutral-300">
            {playerslist.length} predictors ranked
          </span>
          <span className="text-neutral-500">Updated weekly</span>
        </div>
      )}
    </div>
  );
}