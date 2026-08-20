import { UpdateUserDto } from "@/types";
import { api } from "..";
import { useAuthStore } from "@/store/useAuthStore";

export const profileDetail = async () => {
  const res = await api.get("/users/profile", {
    headers: {
      "X-API-Version": "1",
    },
  });

  useAuthStore.getState().updateUser(res.data);
  

  return res.data;
};
export const getLeaderboard = async () => {
  const response = await api.get("/users/leaderboard", {
     headers: {
      "X-API-Version": "1",
    },
  });
  return response.data;
};

export const updateUserProfile = async (id: number, payload: UpdateUserDto) => {
  const response = await api.patch(`/user/${id}`, payload,{
     headers: {
      "X-API-Version": "1",
    },
  });
  console.log(response.data)
  return response.data;
  
};