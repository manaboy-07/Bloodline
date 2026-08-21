import { Match } from "@/types";
import { api } from "..";

export interface CreateMatchDto {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
}

export interface UpdateMatchDto {
  homeScore: number;
  awayScore: number;
  status: "pending" | "live" | "finished";
}

export const getMatches = async (): Promise<Match[]> => {
  const { data } = await api.get<Match[]>("/match");

  return data;
};

// Get single match
export const getMatchById = async (id: number | string) => {
  const { data } = await api.get(`/match/id/${id}`, {
    headers: {
      "X-API-Version": "1",
    },
  });

  return data;
};

// Create match
export const createMatch = async (payload: CreateMatchDto) => {
  const { data } = await api.post("/match/create", payload, {
    headers: {
      "X-API-Version": "1",
    },
  });

  return data;
};

// Update match
export const updateMatch = async (
  id: number | string,
  payload: UpdateMatchDto,
) => {
  const { data } = await api.patch(`/match/${id}`, payload, {
    headers: {
      "X-API-Version": "1",
    },
  });

  return data;
};

// Delete match
export const deleteMatch = async (id: number | string) => {
  const { data } = await api.delete(`/match/${id}`, {
    headers: {
      "X-API-Version": "1",
    },
  });

  return data;
};
