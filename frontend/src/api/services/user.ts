import { UpdateUserDto } from "@/types";

import { useAuthStore } from "@/store/useAuthStore";
import { api } from "..";

export const profileDetail = async () => {
  const { data } = await api.get("/users/profile");

  useAuthStore.getState().setUser(data);

  return data;
};

export const getLeaderboard = async () => {
  const { data } = await api.get("/users/leaderboard");

  return data;
};

export const updateUserProfile = async (id: number, payload: UpdateUserDto) => {
  const { data } = await api.patch(`/user/${id}`, payload);

  useAuthStore.getState().updateUser(data);

  return data;
};
