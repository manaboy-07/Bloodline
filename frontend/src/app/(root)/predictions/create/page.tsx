// src/components/PredictionForm.tsx
//!This should be a component
"use client";
import { createPrediction } from "@/api/services/prediction";
import React, { useState } from "react";

interface PredictionFormProps {
  matchId: number;
}

export default function PredictionForm({ matchId }: PredictionFormProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await createPrediction({
        matchId,
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      });

      setMessage("Prediction submitted successfully");
      setHomeScore("");
      setAwayScore("");
    } catch (error) {
      console.error("Error creating prediction:", error);
      setMessage("Failed to submit prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          placeholder="Home"
          className="w-20 rounded border px-3 py-2"
          required
        />

        <span className="font-semibold">-</span>

        <input
          type="number"
          min="0"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          placeholder="Away"
          className="w-20 rounded border px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit prediction"}
      </button>

      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
