// src/api/predictionservice.ts

import { api } from "..";

export interface PredictionPayload {
  awayScore: number;
  homeScore: number;
  matchId: number;
}

export interface MatchPrediction {
  id: number;
  userId: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  points: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

export const createPrediction = async (payload: PredictionPayload) => {
  const response = await api.post("/prediction", payload);
  return response.data;
};

export const getPredictionsByMatch = async (matchId: number) => {
  const response = await api.get<MatchPrediction[]>("/prediction/match", {
    params: {
      matchId,
    },
  });

  return response.data;
};