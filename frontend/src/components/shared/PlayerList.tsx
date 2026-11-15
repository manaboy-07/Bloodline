"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Crown,
  Medal,
  ShieldCheck,
  Trophy,
  RefreshCw,
  Mail,
} from "lucide-react";

import { getLeaderboard } from "@/api/services/user";
import { LeaderboardEntry } from "@/mockusers";

gsap.registerPlugin(useGSAP);

type LeaderboardProps = {
  isShortList: boolean;
};

const rankStyles = [
  "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  "border-neutral-700 bg-neutral-800 text-neutral-300",
  "border-amber-600/30 bg-amber-500/10 text-amber-500",
];

const RankIcon = ({ position }: { position: number }) => {
  const icons = [Crown, Medal, ShieldCheck];
  const Icon = icons[position - 1];

  if (!Icon) {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-xs font-semibold text-neutral-500">
        #{position}
      </div>
    );
  }

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${rankStyles[position - 1]}`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </div>
  );
};

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3">
      <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-800" />

      <div className="flex min-w-0 items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-neutral-800" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-28 max-w-full animate-pulse rounded bg-neutral-800" />
          <div className="h-3 w-20 max-w-full animate-pulse rounded bg-neutral-800" />
        </div>
      </div>

      <div className="h-7 w-14 animate-pulse rounded-md bg-neutral-800" />
    </div>
  );
}

export default function PlayerList({ isShortList }: LeaderboardProps) {
  const [list, setList] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getLeaderboard();
      setList(data);
    } catch {
      setError("Unable to load the leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const players = isShortList ? list.slice(0, 3) : list;

  useGSAP(
    () => {
      if (loading || error) return;

      const items = gsap.utils.toArray<HTMLElement>(".leaderboard-item");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.045,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [players, loading, error],
      revertOnUpdate: true,
    },
  );

  if (loading) {
    return (
      <div
        className={
          isShortList
            ? "w-full space-y-3"
            : "w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5"
        }
      >
        {!isShortList && (
          <div className="mb-5 flex items-center gap-3 border-b border-neutral-800 pb-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-neutral-800" />
            <div className="space-y-2">
              <div className="h-5 w-36 animate-pulse rounded bg-neutral-800" />
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-800" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {Array.from({ length: isShortList ? 3 : 6 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-10 text-center">
        <p className="text-sm text-neutral-400">{error}</p>

        <button
          type="button"
          onClick={fetchLeaderboard}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          <RefreshCw size={14} />
          Try again
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
          : "w-full min-w-0 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5"
      }
    >
      {!isShortList && (
        <div className="mb-5 flex flex-col gap-3 border-b border-neutral-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950 text-red-400">
              <Trophy size={19} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Leaderboard
              </h2>
              <p className="text-xs text-neutral-500">
                Top predictors this week
              </p>
            </div>
          </div>

          <span className="w-fit rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-medium text-neutral-400">
            {list.length} {list.length === 1 ? "predictor" : "predictors"}
          </span>
        </div>
      )}

      {players.length === 0 ? (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 px-4 py-10 text-center">
          <Trophy className="mx-auto mb-3 text-neutral-600" size={24} />
          <p className="text-sm font-medium text-neutral-300">
            No rankings yet
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Players will appear here once they start earning points.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((user, index) => {
            const position = index + 1;
            const isTopThree = position <= 3;

            return (
              <div
                key={user.id || user.email}
                className="leaderboard-item grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3 transition-colors duration-200 hover:border-neutral-700 hover:bg-neutral-950"
              >
                <RankIcon position={position} />

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${
                      isTopThree
                        ? "border-neutral-700 bg-neutral-800 text-white"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400"
                    }`}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-neutral-500">
                      <span className="truncate">
                        {user.club || "Independent"}
                      </span>

                      {user.email && (
                        <>
                          <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-700" />
                          <span className="hidden min-w-0 items-center gap-1 truncate sm:flex">
                            <Mail size={11} className="shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                    isTopThree
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-neutral-800 text-neutral-300"
                  }`}
                >
                  {user.points} pts
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!isShortList && players.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4 text-xs">
          <span className="text-neutral-400">
            {players.length} players ranked
          </span>
          <span className="text-neutral-500">Updated weekly</span>
        </div>
      )}
    </div>
  );
}
