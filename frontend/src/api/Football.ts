// src/lib/axios.ts

import axios from "axios";

export const sofascoreApi = axios.create({
  baseURL: "https://sofascore.p.rapidapi.com",
  headers: {
    'x-rapidapi-key': '87169f1224msh8562716f5943164p104b6ajsn2f58d3620d10',

    "x-rapidapi-host": "sofascore.p.rapidapi.com",
    "Content-Type": "application/json",
  },
});



export const searchTeams = async (query: string) => {
  const response = await sofascoreApi.get("/teams/search", {
    params: {
      name: query,
    },
  });

  return response.data.teams?.[0]?.id ?? null;
};

export const getTeamLogo = async (teamId: number) => {
  const response = await sofascoreApi.get("/teams/get-logo", {
    params: {
      teamId,
    },
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
};

