// src/api/services/prediction.ts

import { api } from "..";
import { Match } from "../../types";

export interface PredictionPayload {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

export interface UpdatePredictionPayload {
  matchId: number;
  homeScore: number;
  awayScore: number;
}

export interface PredictionUser {
  id: number;
  name: string;
  email: string;
  points: number;
  roleId: number;
  club: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  points: number;
  createdAt: string;
}

export interface PredictionWithMatch extends Prediction {
  match: Match;
}

export interface PredictionWithMatchAndUser extends PredictionWithMatch {
  user: PredictionUser;
}

export const createPrediction = async (
  payload: PredictionPayload,
): Promise<PredictionWithMatchAndUser> => {
  const { data } = await api.post("/prediction", payload);
  return data;
};

export const getAllPredictions = async (): Promise<
  PredictionWithMatchAndUser[]
> => {
  const { data } = await api.get("/prediction");
  return data;
};

export const getMyPredictions = async (): Promise<PredictionWithMatch[]> => {
  const { data } = await api.get("/prediction/mypredictions");
  return data;
};

export const updatePrediction = async (
  payload: UpdatePredictionPayload,
): Promise<Prediction> => {
  const { data } = await api.patch("/prediction", payload);
  return data;
};

export const deletePrediction = async (matchId: number) => {
  const { data } = await api.delete("/prediction", { params: { matchId } });
  return data;
};

export const getPredictionById = async (
  id: number | string,
): Promise<PredictionWithMatchAndUser> => {
  const { data } = await api.get(`/prediction/id/${id}`);
  return data;
};

export const getPredictionsByMatch = async (matchId: number) => {
  const response = await api.get<PredictionWithMatchAndUser[]>(
    "/prediction/match",
    { params: { matchId } },
  );
  return response.data;
};
