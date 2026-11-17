"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  ShieldCheck,
  Trophy,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { profileDetail } from "@/api/services/user";
import Input from "@/components/shared/Input";
import { login, resetSessionExpiredFlag, signup } from "../../../api";

gsap.registerPlugin(useGSAP);

const clubs = [
  "Arsenal",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Tottenham Hotspur",
  "Barcelona",
  "Real Madrid",
  "Bayern Munich",
  "PSG",
  "Other",
];

type Mode = "login" | "signup";

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:text-white"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Trophy;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 border-t border-neutral-800 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-red-500">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const container = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration state
  const [name, setName] = useState("");
  const [club, setClub] = useState("Manchester United");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  useEffect(() => {
    resetSessionExpiredFlag();
  }, []);

  // Main entrance animation
  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          ".auth-panel",
          {
            autoAlpha: 0,
            y: 16,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
          },
        )
        .fromTo(
          ".auth-side-content",
          {
            autoAlpha: 0,
            x: -12,
          },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
          },
          "-=0.25",
        );
    },
    { scope: container },
  );

  // Form transition when switching between login and signup
  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) return;

      gsap.fromTo(
        ".form-field",
        {
          autoAlpha: 0,
          y: 8,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.045,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    {
      scope: formRef,
      dependencies: [mode],
      revertOnUpdate: true,
    },
  );

  const handleLogin = async () => {
    const email = loginEmail.trim().toLowerCase();

    await login(email, loginPassword);

    const profile = await profileDetail();

    toast.success("Welcome back", {
      description: `Logged in as ${profile.name}.`,
    });

    router.replace("/");
  };

  const handleSignup = async () => {
    const email = signupEmail.trim().toLowerCase();
    const username = name.trim();

    await signup(email, signupPassword, username, club);

    toast.success("Account created", {
      description: "Your account is ready. Please log in.",
    });

    setLoginEmail(email);
    setLoginPassword("");
    setSignupPassword("");
    setMode("login");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (mode === "login") {
      const email = loginEmail.trim();

      if (!email || !loginPassword) {
        toast.error("Enter your email and password.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Enter a valid email address.");
        return;
      }
    } else {
      const email = signupEmail.trim();
      const username = name.trim();

      if (!username || !email || !signupPassword) {
        toast.error("Please complete all fields.");
        return;
      }

      if (username.length < 3) {
        toast.error("Username must be at least 3 characters.");
        return;
      }

      if (username.length > 30) {
        toast.error("Username cannot exceed 30 characters.");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Enter a valid email address.");
        return;
      }

      if (signupPassword.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch {
      toast.error(mode === "login" ? "Login failed" : "Registration failed", {
        description:
          mode === "login"
            ? "Check your email and password."
            : "Check your details or try another email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      ref={container}
      className="flex min-h-svh items-center justify-center bg-[#090909] px-4 py-8 text-white sm:px-6"
    >
      <section className="auth-panel grid w-full max-w-6xl overflow-hidden rounded-2xl border border-neutral-800 bg-[#101010] shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        {/* Brand and product information */}
        <aside className="relative flex flex-col justify-between border-b border-neutral-800 bg-[#0c0c0c] p-6 sm:p-10 lg:border-b-0 lg:border-r">
          <div className="auth-side-content">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white">
                <Flame className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight">Bloodline</h1>
                <p className="text-xs font-medium tracking-wide text-neutral-500">
                  PREDICTION LEAGUE
                </p>
              </div>
            </div>

            <div className="mt-14 max-w-md lg:mt-24">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                The game beyond the game
              </div>

              <h2 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl">
                Know the game.
                <br />
                <span className="text-neutral-500">Call the score.</span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-400">
                Make your predictions, earn points, track your performance and
                compete with football minds across the league.
              </p>
            </div>

            <div className="mt-12 space-y-1">
              <Feature
                icon={Trophy}
                title="Compete for the top"
                description="Climb the leaderboard and prove your football knowledge."
              />

              <Feature
                icon={ShieldCheck}
                title="Your own predictor profile"
                description="Create your account, represent your club and build your record."
              />
            </div>
          </div>

          <div className="auth-side-content mt-12 flex items-center justify-between border-t border-neutral-800 pt-5">
            <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-600">
              Bloodline © {new Date().getFullYear()}
            </span>

            <span className="text-[11px] font-medium text-neutral-600">
              Football. Predictions. Competition.
            </span>
          </div>
        </aside>

        {/* Authentication form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                Account access
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                {mode === "login" ? "Welcome back." : "Join Bloodline."}
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {mode === "login"
                  ? "Sign in to continue your prediction journey."
                  : "Create your predictor account and get in the game."}
              </p>
            </div>

            {/* Mode selector */}
            <div className="mb-8 grid grid-cols-2 border-b border-neutral-800">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("login")}
                aria-pressed={mode === "login"}
                className={`relative cursor-pointer py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  mode === "login"
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Login
                {mode === "login" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("signup")}
                aria-pressed={mode === "signup"}
                className={`relative cursor-pointer py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${
                  mode === "signup"
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                Create account
                {mode === "signup" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500" />
                )}
              </button>
            </div>

            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {mode === "login" ? (
                  <>
                    <div className="form-field">
                      <Input
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="form-field">
                      <Input
                        label="Password"
                        type={showLoginPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        rightElement={
                          <PasswordToggle
                            visible={showLoginPassword}
                            onToggle={() =>
                              setShowLoginPassword((prev) => !prev)
                            }
                          />
                        }
                        placeholder="Enter your password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-field group mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Logging in..." : "Sign in"}

                      {!isSubmitting && (
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </button>

                    <p className="form-field pt-3 text-center text-sm text-neutral-500">
                      New to Bloodline?{" "}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMode("signup")}
                        className="cursor-pointer font-semibold text-red-500 transition-colors hover:text-red-400"
                      >
                        Create an account
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="form-field">
                      <Input
                        label="Username"
                        type="text"
                        autoComplete="username"
                        required
                        minLength={3}
                        maxLength={30}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Choose a username"
                      />
                    </div>

                    <div className="form-field">
                      <label
                        htmlFor="club"
                        className="mb-2 block text-sm font-semibold text-neutral-300"
                      >
                        Club supported
                      </label>

                      <select
                        id="club"
                        required
                        value={club}
                        onChange={(e) => setClub(e.target.value)}
                        className="h-12 w-full cursor-pointer rounded-lg border border-neutral-800 bg-[#0b0b0b] px-3 text-sm text-white outline-none transition-colors focus:border-red-500"
                      >
                        {clubs.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-field">
                      <Input
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="form-field">
                      <Input
                        label="Password"
                        type={showSignupPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        rightElement={
                          <PasswordToggle
                            visible={showSignupPassword}
                            onToggle={() =>
                              setShowSignupPassword((prev) => !prev)
                            }
                          />
                        }
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-field group mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}

                      {!isSubmitting && (
                        <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                      )}
                    </button>

                    <p className="form-field pt-3 text-center text-sm text-neutral-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMode("login")}
                        className="cursor-pointer font-semibold text-red-500 transition-colors hover:text-red-400"
                      >
                        Sign in
                      </button>
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
