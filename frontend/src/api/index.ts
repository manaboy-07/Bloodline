import axios, { type AxiosError } from "axios";
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

/**
 * Authentication endpoints are handled by their respective
 * pages/services rather than the global session interceptor.
 */
const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/signout",
] as const;

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;

  try {
    const pathname = new URL(url, baseURL).pathname.replace(/\/+$/, "");

    return AUTH_ENDPOINTS.some((endpoint) => pathname === endpoint);
  } catch {
    return false;
  }
};

/**
 * Axios response interceptor.
 *
 * 401: Unauthenticated / expired session.
 * 403: Authenticated but insufficient permissions.
 */
api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const currentPath = window.location.pathname;

    const isOnAuthPage = currentPath.startsWith("/auth");
    const isOnUnauthorizedPage = currentPath.startsWith("/unauthorized");

    // Authentication errors belong to the authentication flow.
    if (isAuthEndpoint(requestUrl)) {
      return Promise.reject(error);
    }

    // Session is missing or has expired.
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

    // User is authenticated but lacks permission.
    if (status === 403 && !isOnUnauthorizedPage) {
      window.location.replace("/unauthorized");
    }

    return Promise.reject(error);
  },
);

/**
 * Reset session flags when entering the authentication flow.
 */
export const resetSessionExpiredFlag = (): void => {
  hasShownSessionExpiredToast = false;
  isRedirecting = false;
};

// ============================================
// PROFILE ENDPOINTS
// ============================================

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

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

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
