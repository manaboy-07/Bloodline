// lib/api.ts
import axios from "axios";
import { toast } from "sonner";
import { baseURL } from "@/lib/baseurl";
import { useAuthStore } from "@/store/useAuthStore";

let hasShownSessionExpiredToast = false;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});


api.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === "development") {
    console.log("\nREQUEST:");
    console.log("URL:", `${config.baseURL}${config.url}`);
    console.log("METHOD:", config.method?.toUpperCase());
    console.log("PARAMS:", config.params);
    console.log("BODY:", config.data);
    console.log("HEADERS:", config.headers);
  }

  return config;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // 401 — session expired or unauthenticated
    if (status === 401) {
      // Clear auth state first
      useAuthStore.getState().logout();

      if (typeof window !== "undefined") {
        // Only show the toast once per session expiry cycle.
        // The flag resets when the user lands back on /auth (see reset below).
        if (!hasShownSessionExpiredToast) {
          hasShownSessionExpiredToast = true;

          toast.error("Session expired", {
            description: "Please log in again to continue.",
            // Auto-dismiss after 4s so it doesn't linger on the auth page
            duration: 4000,
          });
        }

        // Only redirect if not already on /auth to prevent redirect loops
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth";
        }
      }
    }

    // 403 — authenticated but not authorised
    if (status === 403 && typeof window !== "undefined") {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(err);
  },
);

// Call this once inside your /auth page component (e.g. in a useEffect)
// so the toast can fire again if the user's next session also expires.
export const resetSessionExpiredFlag = () => {
  hasShownSessionExpiredToast = false;
};

// ── Shared headers ─────────────────────────────────────────────────────────

const headers = {
  "X-API-Version": "1",
};



// ── Profile endpoints ──────────────────────────────────────────────────────

export const getProfilesPage = async (page: number, limit: number) => {
  const res = await api.get(`/api/profiles?page=${page}&limit=${limit}`, {
    headers,
  });
  return res.data;
};







export const getAllProfiles = async () => {
  const res = await api.get("/api/profiles", {
    headers,
  });

  return res.data;
};

export const searchProfile = async (query: string) => {
  const res = await api.get("/api/profiles/search", {
    params: {
      q: query,
    },
    headers,
  });

  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await api.post(
    "/auth/login",
    { email, password },
    { headers },
  );

  return res.data;
};

export const signup = async (
  email: string,
  password: string,
  name: string,
  club: string,
) => {
  const res = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
      club,
    },
    { headers },
  );

  return res.data;
};

