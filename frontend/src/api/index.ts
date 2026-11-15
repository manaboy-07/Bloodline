import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { baseURL } from "@/lib/baseurl";
import { useAuthStore } from "@/store/useAuthStore";

let hasShownSessionExpiredToast = false;
let isRedirecting = false;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "X-API-Version": "1",
  },
});

const isAuthEndpoint = (url?: string) => {
  if (!url) return false;

  return ["/auth/login", "/auth/register", "/auth/signout"].some((endpoint) =>
    url.includes(endpoint),
  );
};

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isOnAuthPage = currentPath.startsWith("/auth");
      const isOnUnauthorizedPage = currentPath.startsWith("/unauthorized");

      // Login/register errors should be handled by the auth page.
      if (isAuthEndpoint(requestUrl)) {
        return Promise.reject(error);
      }

      // Unauthenticated request to a protected endpoint.
      if (status === 401) {
        useAuthStore.getState().logout();

        if (!isOnAuthPage && !isRedirecting) {
          if (!hasShownSessionExpiredToast) {
            hasShownSessionExpiredToast = true;

            toast.error("Session expired", {
              description: "Please log in again to continue.",
              duration: 4000,
            });
          }

          isRedirecting = true;
          window.location.replace("/auth");
        }
      }

      // Authenticated, but without permission.
      if (status === 403 && !isOnUnauthorizedPage) {
        window.location.replace("/unauthorized");
      }
    }

    return Promise.reject(error);
  },
);

export const resetSessionExpiredFlag = () => {
  hasShownSessionExpiredToast = false;
  isRedirecting = false;
};

// Profile endpoints

export const getProfilesPage = async (page: number, limit: number) => {
  const { data } = await api.get("/api/profiles", {
    params: { page, limit },
  });

  return data;
};

export const getAllProfiles = async () => {
  const { data } = await api.get("/api/profiles");
  return data;
};

export const searchProfile = async (query: string) => {
  const { data } = await api.get("/api/profiles/search", {
    params: { q: query },
  });

  return data;
};

// Authentication endpoints

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
};

export const signup = async (
  email: string,
  password: string,
  name: string,
  club: string,
) => {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    club,
  });

  return data;
};

export const signOut = async () => {
  const { data } = await api.post("/auth/signout");
  return data;
};
