
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Trophy,
  UsersRound,
} from "lucide-react";
import { getPredictionsByMatch, MatchPrediction } from "@/api/services/prediction";

export default function AdminMatchPredictionsPage() {
  const router = useRouter();
  const params = useParams();

  const matchId = Number(params.matchId);

  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPredictionsByMatch(matchId);
        setPredictions(data);
      } catch (error) {
        console.error("Error loading predictions:", error);
        setError("Could not load predictions for this match.");
      } finally {
        setLoading(false);
      }
    };

    if (Number.isFinite(matchId)) {
      fetchPredictions();
    }
  }, [matchId]);

  return (
    <main className="min-h-svh w-full bg-neutral-950 p-4 text-white sm:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex h-10 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 text-sm font-bold text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-red-400">
                <Trophy className="h-3.5 w-3.5" />
                Admin Predictions
              </div>

              <h1 className="text-3xl font-black tracking-tight">
                Match #{matchId} Predictions
              </h1>

              <p className="mt-2 text-sm text-neutral-400">
                Users who submitted score predictions for this match.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                Total
              </p>
              <p className="mt-1 text-3xl font-black tabular-nums">
                {predictions.length}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-neutral-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading predictions...
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 text-red-400" />
              <p className="font-bold text-red-400">{error}</p>
            </div>
          ) : predictions.length === 0 ? (
            <div className="py-12 text-center">
              <UsersRound className="mx-auto h-9 w-9 text-neutral-600" />
              <p className="mt-3 font-bold text-neutral-400">
                No predictions yet
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Nobody has predicted this match.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-neutral-800 text-xs uppercase tracking-[0.14em] text-neutral-500">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Prediction</th>
                    <th className="px-4 py-3">Points</th>
                    <th className="px-4 py-3">Submitted</th>
                  </tr>
                </thead>

                <tbody>
                  {predictions.map((prediction) => (
                    <tr
                      key={prediction.id}
                      className="border-b border-neutral-800 last:border-0"
                    >
                      <td className="px-4 py-4">
                        <p className="font-black text-white">
                          {prediction.user.name}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          User ID: {prediction.user.id}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1 font-black text-red-400">
                          {prediction.homeScore} - {prediction.awayScore}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-black text-white">
                        {prediction.points}
                      </td>

                      <td className="px-4 py-4 text-neutral-400">
                        {new Date(prediction.createdAt).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}