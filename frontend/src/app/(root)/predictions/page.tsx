"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  ShieldAlert,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { gsap } from "gsap";

import { useMatches } from "@/hooks/useMatch";

import { useCreatePrediction } from "@/hooks/useCreatePrediction";
import { useUpdatePrediction } from "@/hooks/useUpdatePrediction";
import { useDeletePrediction } from "@/hooks/useDeletePrediction";
import { useAuthStore } from "@/store/useAuthStore";
import { Match, MatchStatus } from "@/types";
import { PredictionWithMatch } from "@/api/services/prediction";
import LogoTeam from "@/components/logoTeam";
import { useMyPredictions } from "../../../hooks/useMyPrediction";

function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const cfg: Record<
    MatchStatus,
    { icon: React.ReactNode; label: string; className: string }
  > = {
    upcoming: {
      icon: <Clock className="h-3 w-3" />,
      label: "Upcoming",
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

  const { icon, label, className } = cfg[status];

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
  tone = "white",
}: {
  homeScore: number;
  awayScore: number;
  tone?: "white" | "red";
}) {
  return (
    <span
      className={`rounded-lg border px-3 py-1 text-sm font-black tabular-nums ${
        tone === "red"
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-neutral-700 bg-neutral-950 text-white"
      }`}
    >
      {homeScore} : {awayScore}
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
        <div className="h-11 w-56 animate-pulse rounded-lg bg-neutral-800" />
      </div>
    </div>
  );
}

// ── Edit modal ───────────────────────────────────────────────────────────────

function EditPredictionModal({
  prediction,
  onClose,
  onConfirm,
  isPending,
}: {
  prediction: PredictionWithMatch;
  onClose: () => void;
  onConfirm: (homeScore: number, awayScore: number) => void;
  isPending: boolean;
}) {
  const [homeScore, setHomeScore] = useState(prediction.homeScore.toString());
  const [awayScore, setAwayScore] = useState(prediction.awayScore.toString());
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.6)" },
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
          Edit prediction
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          {prediction.match.homeTeam} vs {prediction.match.awayTeam}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">
                {prediction.match.homeTeam}
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
                {prediction.match.awayTeam}
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
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Match / prediction card ─────────────────────────────────────────────────

function PredictionCard({
  match,
  prediction,
  onCreate,
  onEdit,
  onDelete,
  createPending,
  deletePending,
}: {
  match: Match;
  prediction?: PredictionWithMatch;
  onCreate: (
    matchId: number,
    homeScore: number,
    awayScore: number,
  ) => Promise<void>;
  onEdit: (prediction: PredictionWithMatch) => void;
  onDelete: (matchId: number, el: HTMLElement | null) => void;
  createPending: boolean;
  deletePending: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isUpcoming = match.status === "upcoming";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (homeScore === "" || awayScore === "") {
      toast.error("Enter both scores");
      return;
    }
    try {
      setSubmitting(true);
      await onCreate(match.id, Number(homeScore), Number(awayScore));
      setHomeScore("");
      setAwayScore("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article
      ref={cardRef}
      className="prediction-card rounded-xl border border-neutral-800 bg-neutral-900 p-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Match info */}
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
            <div className="flex items-center gap-2">
              <LogoTeam teamName={match.homeTeam} />
              <span className="text-lg font-black leading-none">
                {match.homeTeam}
              </span>
            </div>

            {match.isScored ? (
              <ScorePill
                homeScore={match.homeScore ?? 0}
                awayScore={match.awayScore ?? 0}
              />
            ) : (
              <span className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1 text-sm font-black text-neutral-600">
                vs
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg font-black leading-none">
                {match.awayTeam}
              </span>
              <LogoTeam teamName={match.awayTeam} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <MatchStatusBadge status={match.status} />
            {prediction && match.isScored && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-400">
                <Sparkles className="h-3 w-3" />
                {prediction.points} pt{prediction.points === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>

        {/* Action area */}
        <div className="w-full shrink-0 lg:w-auto">
          {prediction ? (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  Your prediction
                </p>
                <p className="mt-1">
                  <ScorePill
                    homeScore={prediction.homeScore}
                    awayScore={prediction.awayScore}
                    tone="red"
                  />
                </p>
              </div>

              {isUpcoming && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(prediction)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300 active:scale-95"
                    aria-label="Edit prediction"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={deletePending}
                    onClick={() => onDelete(match.id, cardRef.current)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 transition hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Delete prediction"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : isUpcoming ? (
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Home
                </span>
                <input
                  type="number"
                  min={0}
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  className="h-11 w-16 rounded-lg border border-neutral-800 bg-neutral-950 text-center text-lg font-black text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                />
              </label>
              <span className="pb-3 font-black text-neutral-600">–</span>
              <label className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
                  Away
                </span>
                <input
                  type="number"
                  min={0}
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  className="h-11 w-16 rounded-lg border border-neutral-800 bg-neutral-950 text-center text-lg font-black text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10"
                />
              </label>
              <button
                type="submit"
                disabled={submitting || createPending}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting || createPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Target className="h-4 w-4" />
                )}
                Predict
              </button>
            </form>
          ) : (
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-center">
              <p className="text-xs font-bold text-neutral-600">
                Predictions closed
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PredictionsPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [editTarget, setEditTarget] = useState<PredictionWithMatch | null>(
    null,
  );

  const {
    data: matches = [],
    isLoading: matchesLoading,
    error: matchesError,
  } = useMatches();

  const {
    data: myPredictions = [],
    isLoading: predictionsLoading,
    error: predictionsError,
  } = useMyPredictions();

  const createMutation = useCreatePrediction();
  const updateMutation = useUpdatePrediction();
  const deleteMutation = useDeletePrediction();

  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isLoading = matchesLoading || predictionsLoading;
  const error = matchesError || predictionsError;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) window.location.href = "/auth";
  }, [hasHydrated, isAuthenticated]);

  useEffect(() => {
    if (isLoading || !hasHydrated) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        listRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.15 },
      );
    });
    return () => ctx.revert();
  }, [isLoading, hasHydrated]);

  useEffect(() => {
    if (!listRef.current || isLoading) return;
    const cards =
      listRef.current.querySelectorAll<HTMLElement>(".prediction-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.06,
        clearProps: "all",
      },
    );
  }, [matches, myPredictions, isLoading]);

  const predictionByMatchId = new Map(myPredictions.map((p) => [p.matchId, p]));

  const sortedMatches = [...matches].sort(
    (a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime(),
  );

  const totalPoints = myPredictions.reduce((sum, p) => sum + p.points, 0);

  const handleCreate = async (
    matchId: number,
    homeScore: number,
    awayScore: number,
  ) => {
    try {
      await createMutation.mutateAsync({ matchId, homeScore, awayScore });
      toast.success("Prediction submitted");
    } catch (err) {
      console.error(err);
      toast.error("Could not submit prediction");
    }
  };

  const handleUpdate = async (homeScore: number, awayScore: number) => {
    if (!editTarget) return;
    try {
      await updateMutation.mutateAsync({
        matchId: editTarget.matchId,
        homeScore,
        awayScore,
      });
      toast.success("Prediction updated");
      setEditTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Could not update prediction");
    }
  };

  const handleDelete = async (matchId: number, cardEl: HTMLElement | null) => {
    const confirmed = confirm("Delete this prediction?");
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
      await deleteMutation.mutateAsync(matchId);
      toast.success("Prediction deleted");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete prediction");
      if (cardEl)
        gsap.to(cardEl, { opacity: 1, x: 0, height: "auto", duration: 0.2 });
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
              <div className="h-16 w-40 animate-pulse rounded-xl bg-neutral-800" />
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-black text-red-400">
                  Failed to load predictions
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
                    Predictions
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">
                    Make your calls
                  </h1>
                  <p className="mt-2 text-sm text-neutral-400">
                    Predict scorelines before kickoff and climb the table.
                  </p>
                </div>

                <div className="flex shrink-0 gap-3">
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Predictions
                    </p>
                    <p className="mt-1 text-3xl font-black tabular-nums text-white">
                      {myPredictions.length}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Points
                    </p>
                    <p className="mt-1 text-3xl font-black tabular-nums text-red-400">
                      {totalPoints}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Match list */}
          <div
            ref={listRef}
            className="flex flex-col gap-3"
            style={{ opacity: 0 }}
          >
            {sortedMatches.length === 0 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-8 text-center">
                <ShieldAlert className="mx-auto h-8 w-8 text-neutral-600" />
                <p className="mt-3 font-bold text-neutral-400">
                  No matches yet
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Check back once fixtures are announced.
                </p>
              </div>
            ) : (
              sortedMatches.map((match) => (
                <PredictionCard
                  key={match.id}
                  match={match}
                  prediction={predictionByMatchId.get(match.id)}
                  onCreate={handleCreate}
                  onEdit={setEditTarget}
                  onDelete={handleDelete}
                  createPending={createMutation.isPending}
                  deletePending={deleteMutation.isPending}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {editTarget && (
        <EditPredictionModal
          prediction={editTarget}
          isPending={updateMutation.isPending}
          onClose={() => setEditTarget(null)}
          onConfirm={handleUpdate}
        />
      )}
    </>
  );
}
