"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Plus,
  ShieldAlert,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { gsap } from "gsap";

import { useCreateMatch } from "@/hooks/useCreateMatch";
import { useUpdateMatch } from "@/hooks/useUpdateMatch";
import { useDeleteMatch } from "@/hooks/useDeleteMatch";
import { useAuthStore } from "@/store/useAuthStore";
import { useMatches } from "@/hooks/useMatch";
import { Match } from "@/types";
import LogoTeam from "@/components/logoTeam";

/* -------------------------------------------------------------------------- */
/*                                Status badge                                */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: Match["status"] }) {
  const config: Record<
    string,
    {
      icon: React.ReactNode;
      label: string;
      className: string;
    }
  > = {
    scheduled: {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: "Scheduled",
      className: "border-neutral-700 bg-neutral-800 text-neutral-300",
    },
    live: {
      icon: <Zap className="h-3.5 w-3.5" />,
      label: "Live",
      className: "border-green-500/20 bg-green-500/10 text-green-400",
    },
    finished: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      label: "Full Time",
      className: "border-red-500/20 bg-red-500/10 text-red-400",
    },
  };

  const { icon, label, className } = config[status] ?? config.scheduled;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Score pill                                 */
/* -------------------------------------------------------------------------- */

function ScorePill({
  homeScore,
  awayScore,
}: {
  homeScore?: number | null;
  awayScore?: number | null;
}) {
  const hasScore =
    homeScore !== undefined &&
    homeScore !== null &&
    awayScore !== undefined &&
    awayScore !== null;

  return (
    <span className="inline-flex min-w-[76px] items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm font-bold tabular-nums text-white">
      {hasScore ? (
        <>
          <span>{homeScore}</span>
          <span className="mx-2 text-neutral-600">:</span>
          <span>{awayScore}</span>
        </>
      ) : (
        <span className="text-neutral-600">– : –</span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Skeleton card                               */
/* -------------------------------------------------------------------------- */

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-neutral-800" />

          <div className="flex items-center gap-3">
            <div className="h-6 w-28 animate-pulse rounded bg-neutral-800" />
            <div className="h-8 w-20 animate-pulse rounded bg-neutral-800" />
            <div className="h-6 w-28 animate-pulse rounded bg-neutral-800" />
          </div>

          <div className="h-6 w-20 animate-pulse rounded bg-neutral-800" />
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-800" />
          <div className="h-10 w-24 animate-pulse rounded-lg bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Finish modal                                */
/* -------------------------------------------------------------------------- */

function FinishModal({
  match,
  onClose,
  onConfirm,
  isPending,
}: {
  match: Match;
  onClose: () => void;
  onConfirm: (homeScore: number, awayScore: number) => void;
  isPending: boolean;
}) {
  const [homeScore, setHomeScore] = useState(
    match.homeScore?.toString() ?? "0",
  );

  const [awayScore, setAwayScore] = useState(
    match.awayScore?.toString() ?? "0",
  );

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const homeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.18,
            ease: "power2.out",
          },
        );

        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.22,
            ease: "power2.out",
          },
        );
      });

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    homeInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPending, onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0
    ) {
      toast.error("Enter valid non-negative whole-number scores");
      return;
    }

    onConfirm(home, away);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={() => {
        if (!isPending) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-modal-title"
        className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5">
          <h2 id="finish-modal-title" className="text-lg font-bold text-white">
            Record result
          </h2>

          <p className="mt-1 text-sm text-neutral-400">
            {match.homeTeam} vs {match.awayTeam}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <label className="min-w-0 space-y-2">
              <span className="block truncate text-xs font-medium text-neutral-400">
                {match.homeTeam}
              </span>

              <input
                ref={homeInputRef}
                type="number"
                min={0}
                step={1}
                required
                value={homeScore}
                onChange={(event) => setHomeScore(event.target.value)}
                disabled={isPending}
                className="h-14 w-full rounded-lg border border-neutral-700 bg-neutral-950 text-center text-2xl font-bold text-white outline-none transition focus:border-red-500 disabled:opacity-50"
              />
            </label>

            <span className="pb-3 text-lg font-bold text-neutral-600">:</span>

            <label className="min-w-0 space-y-2">
              <span className="block truncate text-xs font-medium text-neutral-400">
                {match.awayTeam}
              </span>

              <input
                type="number"
                min={0}
                step={1}
                required
                value={awayScore}
                onChange={(event) => setAwayScore(event.target.value)}
                disabled={isPending}
                className="h-14 w-full rounded-lg border border-neutral-700 bg-neutral-950 text-center text-2xl font-bold text-white outline-none transition focus:border-red-500 disabled:opacity-50"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-11 flex-1 rounded-lg border border-neutral-700 text-sm font-semibold text-neutral-300 transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save result"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Match card                                 */
/* -------------------------------------------------------------------------- */

function MatchCard({
  match,
  updateIsPending,
  deleteIsPending,
  onFinish,
  onDelete,
}: {
  match: Match;
  updateIsPending: boolean;
  deleteIsPending: boolean;
  onFinish: () => void;
  onDelete: (id: number) => void;
}) {
  const matchDate = new Date(match.matchDate);

  const formattedDate = Number.isNaN(matchDate.getTime())
    ? "Date unavailable"
    : matchDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-neutral-700">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />

            <time dateTime={match.matchDate}>{formattedDate}</time>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <LogoTeam teamName={match.homeTeam} />

              <span className="text-sm font-semibold text-white sm:text-base">
                {match.homeTeam}
              </span>
            </div>

            <ScorePill
              homeScore={match.homeScore}
              awayScore={match.awayScore}
            />

            <div className="flex min-w-0 items-center gap-2">
              <LogoTeam teamName={match.awayTeam} />

              <span className="text-sm font-semibold text-white sm:text-base">
                {match.awayTeam}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <StatusBadge status={match.status} />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={updateIsPending}
            onClick={onFinish}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-3.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateIsPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            {updateIsPending ? "Updating..." : "Finish"}
          </button>

          <Link
            href={`/admin/predictions/${match.id}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:text-white"
          >
            <Eye className="h-4 w-4" />
            Predictions
          </Link>

          <button
            type="button"
            disabled={deleteIsPending}
            onClick={() => onDelete(match.id)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 text-sm font-medium text-neutral-400 transition hover:border-red-500/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteIsPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}

            {deleteIsPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Loading page                                */
/* -------------------------------------------------------------------------- */

function MatchesSkeleton() {
  return (
    <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-800" />
            <div className="h-8 w-48 animate-pulse rounded bg-neutral-800" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-neutral-800" />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-800" />

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-neutral-800"
              />
            ))}
          </div>
        </div>

        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Matches page                                 */
/* -------------------------------------------------------------------------- */

export default function MatchesPage() {
  const router = useRouter();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [finishTarget, setFinishTarget] = useState<Match | null>(null);

  const { data: matches = [], isLoading, error } = useMatches();

  const createMatchMutation = useCreateMatch();
  const updateMatchMutation = useUpdateMatch();
  const deleteMatchMutation = useDeleteMatch();

  const pageRef = useRef<HTMLDivElement>(null);

  /* -------------------------- Authentication -------------------------- */

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/auth");
    }
  }, [hasHydrated, isAuthenticated, router]);

  /* --------------------------- Page entrance --------------------------- */

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || isLoading) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".page-intro",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [hasHydrated, isAuthenticated, isLoading]);

  /* ---------------------------- Create match --------------------------- */

  const handleCreateMatch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const home = homeTeam.trim();
    const away = awayTeam.trim();

    if (!home || !away || !matchDate) {
      toast.error("Please fill all match fields");
      return;
    }

    const parsedDate = new Date(matchDate);

    if (Number.isNaN(parsedDate.getTime())) {
      toast.error("Please enter a valid match date");
      return;
    }

    try {
      await createMatchMutation.mutateAsync({
        homeTeam: home,
        awayTeam: away,
        matchDate: parsedDate.toISOString(),
      });

      setHomeTeam("");
      setAwayTeam("");
      setMatchDate("");

      toast.success("Match created");
    } catch {
      toast.error("Could not create match");
    }
  };

  /* ---------------------------- Finish match --------------------------- */

  const handleFinishMatch = async (
    match: Match,
    homeScore: number,
    awayScore: number,
  ) => {
    try {
      await updateMatchMutation.mutateAsync({
        id: match.id,
        payload: {
          homeScore,
          awayScore,
          status: "finished",
        },
      });

      setFinishTarget(null);
      toast.success("Match result updated");
    } catch {
      toast.error("Could not update match");
    }
  };

  /* ---------------------------- Delete match --------------------------- */

  const handleDeleteMatch = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this match?",
    );

    if (!confirmed) return;

    try {
      await deleteMatchMutation.mutateAsync(id);
      toast.success("Match deleted");
    } catch {
      toast.error("Could not delete match");
    }
  };

  /* ------------------------------ UI states ---------------------------- */

  if (!hasHydrated || !isAuthenticated || isLoading) {
    return <MatchesSkeleton />;
  }

  if (error) {
    return (
      <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-500/20 bg-neutral-900 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

              <div>
                <p className="font-semibold text-white">
                  Failed to load matches
                </p>

                <p className="mt-1 text-sm text-neutral-400">
                  Check your connection and try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
        <div
          ref={pageRef}
          className="mx-auto flex w-full max-w-5xl flex-col gap-5"
        >
          {/* Header */}

          <section className="page-intro rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                  <Trophy className="h-4 w-4" />
                  Match administration
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Manage Matches
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-400">
                  Create fixtures, update scores, and manage finished games.
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 sm:min-w-32 sm:flex-col sm:items-center sm:gap-1">
                <p className="text-xs font-medium text-neutral-500">
                  Total matches
                </p>

                <p className="text-2xl font-bold tabular-nums text-white">
                  {matches.length}
                </p>
              </div>
            </div>
          </section>

          {/* Create match */}

          <section className="page-intro rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-red-400" />

              <h2 className="text-base font-semibold text-white">
                Create match
              </h2>
            </div>

            <form
              onSubmit={handleCreateMatch}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <input
                value={homeTeam}
                onChange={(event) => setHomeTeam(event.target.value)}
                placeholder="Home team"
                required
                disabled={createMatchMutation.isPending}
                className="h-11 min-w-0 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500 disabled:opacity-50"
              />

              <input
                value={awayTeam}
                onChange={(event) => setAwayTeam(event.target.value)}
                placeholder="Away team"
                required
                disabled={createMatchMutation.isPending}
                className="h-11 min-w-0 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500 disabled:opacity-50"
              />

              <input
                value={matchDate}
                onChange={(event) => setMatchDate(event.target.value)}
                type="datetime-local"
                required
                disabled={createMatchMutation.isPending}
                className="h-11 min-w-0 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-red-500 disabled:opacity-50 [color-scheme:dark]"
              />

              <button
                type="submit"
                disabled={createMatchMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 lg:col-span-1"
              >
                {createMatchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {createMatchMutation.isPending ? "Creating..." : "Create"}
              </button>
            </form>
          </section>

          {/* Match list */}

          <section className="page-intro space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-300">
                Fixtures
              </h2>

              <span className="text-xs text-neutral-500">
                {matches.length} {matches.length === 1 ? "match" : "matches"}
              </span>
            </div>

            {matches.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-12 text-center">
                <ShieldAlert className="mx-auto h-7 w-7 text-neutral-600" />

                <p className="mt-3 font-semibold text-neutral-300">
                  No matches yet
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Use the form above to create your first fixture.
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  updateIsPending={updateMatchMutation.isPending}
                  deleteIsPending={deleteMatchMutation.isPending}
                  onFinish={() => setFinishTarget(match)}
                  onDelete={handleDeleteMatch}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {/* Finish modal */}

      {finishTarget && (
        <FinishModal
          match={finishTarget}
          isPending={updateMatchMutation.isPending}
          onClose={() => setFinishTarget(null)}
          onConfirm={(home, away) =>
            handleFinishMatch(finishTarget, home, away)
          }
        />
      )}
    </>
  );
}
