"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import {
  CalendarDays,
  Plus,
  ShieldAlert,
  Trash2,
  Trophy,
  Loader2,
  CheckCircle2,
  Clock,
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


function StatusBadge({ status }: { status: Match["status"] }) {
  const cfg: Record<
    string,
    { icon: React.ReactNode; label: string; className: string }
  > = {
    scheduled: {
      icon: <Clock className="h-3 w-3" />,
      label: "Scheduled",
      className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    },
    live: {
      icon: <Zap className="h-3 w-3 animate-pulse" />,
      label: "Live",
      className: "border-green-500/20 bg-green-500/10 text-green-400",
    },
    finished: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Full Time",
      className: "border-red-500/20 bg-red-500/10 text-red-400",
    },
  };

  const { icon, label, className } = cfg[status] ?? cfg.scheduled;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}


function ScorePill({
  homeScore,
  awayScore,
}: {
  homeScore?: number;
  awayScore?: number;
}) {
  const hasScore = homeScore !== undefined && awayScore !== undefined;
  return (
    <span className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1 text-sm font-black tabular-nums text-red-400">
      {hasScore ? `${homeScore} : ${awayScore}` : "– : –"}
    </span>
  );
}


function SkeletonCard() {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="h-3 w-32 animate-pulse rounded bg-neutral-800" />
          <div className="flex items-center gap-3">
            <div className="h-6 w-28 animate-pulse rounded bg-neutral-800" />
            <div className="h-7 w-16 animate-pulse rounded-lg bg-neutral-800" />
            <div className="h-6 w-28 animate-pulse rounded bg-neutral-800" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-lg bg-neutral-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-lg bg-neutral-800" />
          <div className="h-10 w-20 animate-pulse rounded-lg bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}


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
    match.homeScore?.toString() ?? "0"
  );
  const [awayScore, setAwayScore] = useState(
    match.awayScore?.toString() ?? "0"
  );
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.6)" }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.18,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const h = Number(homeScore);
    const a = Number(awayScore);
    if (Number.isNaN(h) || Number.isNaN(a)) {
      toast.error("Scores must be valid numbers");
      return;
    }
    onConfirm(h, a);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-black tracking-tight text-white">
          Record result
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          {match.homeTeam} vs {match.awayTeam}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                {match.homeTeam}
              </span>
              <input
                type="number"
                min={0}
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="h-14 rounded-lg border border-neutral-700 bg-neutral-950 text-center text-2xl font-black text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
              />
            </label>
            <span className="pb-3 text-xl font-black text-neutral-600">—</span>
            <label className="flex flex-col gap-1.5">
              <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                {match.awayTeam}
              </span>
              <input
                type="number"
                min={0}
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="h-14 rounded-lg border border-neutral-700 bg-neutral-950 text-center text-2xl font-black text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="h-11 flex-1 rounded-lg border border-neutral-700 bg-transparent text-sm font-bold text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
  onDelete: (id: number, el: HTMLElement | null) => void;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -2,
      borderColor: "rgba(255,255,255,0.1)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      borderColor: "rgba(255,255,255,0.06)",
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <article
      ref={cardRef}
      className="match-card rounded-xl border border-neutral-800 bg-neutral-900 p-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <time dateTime={match.matchDate}>
              {new Date(match.matchDate).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xl font-black leading-none">
              <LogoTeam teamName={match.homeTeam}/> <br />
              {match.homeTeam}</p>
            <ScorePill homeScore={match.homeScore || 0} awayScore={match.awayScore || 0} />
            <p className="text-xl font-black leading-none">
               <LogoTeam teamName={match.awayTeam}/> <br />
              {match.awayTeam}
            </p>
          </div>

          <div className="mt-3">
            <StatusBadge status={match.status} />
          </div>
        </div>

        {/* Actions */}
       <div className="flex shrink-0 flex-wrap items-center gap-2">
  <button
    type="button"
    disabled={updateIsPending}
    onClick={onFinish}
    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {updateIsPending ? (
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
    ) : (
      <CheckCircle2 className="h-3.5 w-3.5" />
    )}
    {updateIsPending ? "Updating..." : "Finish"}
  </button>

  <Link
    href={`/Admin/predictions/${match.id}`}
    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-4 text-sm font-bold text-neutral-300 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300 active:scale-95"
  >
    <Eye className="h-3.5 w-3.5" />
    Predictions
  </Link>

  <button
    type="button"
    disabled={deleteIsPending}
    onClick={() => onDelete(match.id, cardRef.current)}
    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 px-4 text-sm font-bold text-neutral-300 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <Trash2 className="h-3.5 w-3.5" />
    {deleteIsPending ? "Deleting..." : "Delete"}
  </button>
</div>
      </div>
    </article>
  );
}


export default function MatchesPage() {
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

  // GSAP refs
  const headerRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  
  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) window.location.href = "/auth";
  }, [hasHydrated, isAuthenticated]);

  // Debug
  useEffect(() => {
    if (matches.length > 0) console.log("Matches fetched:", matches);
  }, [matches]);


  useEffect(() => {
    if (isLoading || !hasHydrated) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        formSectionRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.12 }
      );
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.22 }
      );
    });
    return () => ctx.revert();
  }, [isLoading, hasHydrated]);

  
  useEffect(() => {
    if (!counterRef.current) return;
    gsap.fromTo(
      counterRef.current,
      { scale: 1.3, color: "#ef4444" },
      { scale: 1, color: "#ffffff", duration: 0.4, ease: "back.out(2)" }
    );
  }, [matches.length]);

 
  useEffect(() => {
    if (!listRef.current || isLoading) return;
    const cards =
      listRef.current.querySelectorAll<HTMLElement>(".match-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.07,
        clearProps: "all",
      }
    );
  }, [matches, isLoading]);

  
  const handleCreateMatch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!homeTeam || !awayTeam || !matchDate) {
      toast.error("Please fill all match fields");
      return;
    }

    try {
      await createMatchMutation.mutateAsync({
        homeTeam,
        awayTeam,
        matchDate: new Date(matchDate).toISOString(),
      });

      setHomeTeam("");
      setAwayTeam("");
      setMatchDate("");

      toast.success("Match created");
    } catch (error) {
      console.error(error);
      toast.error("Could not create match");
    }
  };

  const handleFinishMatch = async (
    match: Match,
    homeScore: number,
    awayScore: number
  ) => {
    try {
      await updateMatchMutation.mutateAsync({
        id: match.id,
        payload: { homeScore, awayScore, status: "finished" },
      });
      setFinishTarget(null);
      toast.success("Match updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update match");
    }
  };

  const handleDeleteMatch = async (
    id: number,
    cardEl: HTMLElement | null
  ) => {
    const confirmed = confirm("Delete this match?");
    if (!confirmed) return;

    if (cardEl) {
      await gsap.to(cardEl, {
        opacity: 0,
        x: -20,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
        duration: 0.28,
        ease: "power2.in",
      });
    }

    try {
      await deleteMatchMutation.mutateAsync(id);
      toast.success("Match deleted");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete match");
      if (cardEl)
        gsap.to(cardEl, {
          opacity: 1,
          x: 0,
          height: "auto",
          duration: 0.2,
        });
    }
  };

  
  if (!hasHydrated || isLoading) {
    return (
      <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
        <div className="mx-auto w-full max-w-5xl space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-5 w-24 animate-pulse rounded-lg bg-neutral-800" />
                <div className="h-8 w-48 animate-pulse rounded-lg bg-neutral-800" />
                <div className="h-4 w-64 animate-pulse rounded bg-neutral-800" />
              </div>
              <div className="h-16 w-28 animate-pulse rounded-xl bg-neutral-800" />
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="h-6 w-32 animate-pulse rounded bg-neutral-800" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-neutral-800"
                />
              ))}
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    console.log(error);
    return (
      <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-black text-red-400">
                  Failed to load matches
                </p>
                <p className="mt-1 text-sm text-red-400/70">
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">

          {/* Header */}
          <div ref={headerRef} style={{ opacity: 0 }}>
            <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-red-400">
                    <Trophy className="h-3.5 w-3.5" />
                    Match Admin
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">
                    Manage Matches
                  </h1>
                  <p className="mt-2 text-sm text-neutral-400">
                    Create fixtures, update scores, and close finished games.
                  </p>
                </div>

                <div className="shrink-0 rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                    Total matches
                  </p>
                  <p
                    ref={counterRef}
                    className="mt-1 text-3xl font-black tabular-nums text-white"
                  >
                    {matches.length}
                  </p>
                </div>
              </div>
            </section>
          </div>

         
          <section
            ref={formSectionRef}
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            style={{ opacity: 0 }}
          >
            <h2 className="text-lg font-black tracking-tight">
              Create match
            </h2>

            <form
              onSubmit={handleCreateMatch}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <input
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Home team"
                className="h-12 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
              />

              <input
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Away team"
                className="h-12 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
              />

              <input
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                type="datetime-local"
                className="h-12 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10 [color-scheme:dark]"
              />

              <button
                type="submit"
                disabled={createMatchMutation.isPending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-6 text-sm font-black text-white transition hover:bg-red-500 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:col-span-1"
              >
                {createMatchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {createMatchMutation.isPending ? "Creating…" : "Create"}
              </button>
            </form>
          </section>

        
          <div
            ref={listRef}
            className="flex flex-col gap-3"
            style={{ opacity: 0 }}
          >
            {matches.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-neutral-600" />
                <p className="mt-3 font-bold text-neutral-400">
                  No matches yet
                </p>
                <p className="mt-1 text-sm text-neutral-600">
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
          </div>
        </div>
      </main>

      {/* Finish modal */}
      {finishTarget && (
        <FinishModal
          match={finishTarget}
          isPending={updateMatchMutation.isPending}
          onClose={() => setFinishTarget(null)}
          onConfirm={(h, a) => handleFinishMatch(finishTarget, h, a)}
        />
      )}
    </>
  );
}
