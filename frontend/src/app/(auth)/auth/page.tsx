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
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition hover:text-white"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Trophy;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-red-400">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500">{text}</p>
        </div>
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

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [name, setName] = useState("");
  const [club, setClub] = useState("Manchester United");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  useEffect(() => {
    resetSessionExpiredFlag();
  }, []);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(".auth-panel, .auth-side", {
          autoAlpha: 1,
          clearProps: "all",
        });
        return;
      }

      gsap.set(".auth-panel", {
        autoAlpha: 0,
        y: 18,
      });

      gsap.set(".auth-side", {
        autoAlpha: 0,
        x: -18,
      });

      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .to(".auth-panel", {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
        })
        .to(
          ".auth-side",
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
          },
          "-=0.3",
        );
    },
    { scope: container },
  );

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
          y: 10,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.04,
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
      if (!loginEmail.trim() || !loginPassword) {
        toast.error("Enter your email and password.");
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
      className="flex min-h-svh items-center justify-center bg-neutral-950 px-4 py-6 text-white sm:px-6"
    >
      <section className="auth-panel invisible grid w-full max-w-6xl overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-[0_24px_90px_rgba(0,0,0,0.45)] lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="auth-side invisible relative border-b border-neutral-800 bg-neutral-950 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
              <Flame className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">Bloodline</h1>
              <p className="text-sm text-neutral-500">Prediction League</p>
            </div>
          </div>

          <div className="mt-8 max-w-md sm:mt-10 lg:mt-12">
            <p className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              <Flame className="h-4 w-4" />
              Football predictions
            </p>

            <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Predict matches and climb the table.
            </h2>

            <p className="mt-5 text-sm leading-6 text-neutral-400 sm:text-base">
              Make your score predictions, earn points, track your form, and
              compete with other football minds each week.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10">
            <Feature
              icon={Trophy}
              title="Leaderboard battles"
              text="Compare points and ranking movement every week."
            />

            <Feature
              icon={ShieldCheck}
              title="Simple account setup"
              text="Create your predictor profile and pick your club."
            />
          </div>
        </aside>

        <section className="flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-7 grid grid-cols-2 rounded-lg border border-neutral-800 bg-neutral-950 p-1">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("login")}
                className={`h-10 cursor-pointer rounded-md text-sm font-bold transition disabled:cursor-not-allowed ${
                  mode === "login"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setMode("signup")}
                className={`h-10 cursor-pointer rounded-md text-sm font-bold transition disabled:cursor-not-allowed ${
                  mode === "signup"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <div ref={formRef}>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {mode === "login" ? (
                  <>
                    <div className="form-field">
                      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                        Welcome back
                      </h2>

                      <p className="mt-2 text-sm text-neutral-500">
                        Continue your prediction run.
                      </p>
                    </div>

                    <div className="form-field">
                      <Input
                        label="Email"
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
                      className="form-field group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </button>

                    <p className="form-field text-sm text-neutral-500">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMode("signup")}
                        className="cursor-pointer font-bold text-red-400 transition hover:text-red-300"
                      >
                        Create account
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="form-field">
                      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                        Join Bloodline
                      </h2>

                      <p className="mt-2 text-sm text-neutral-500">
                        Build your predictor profile.
                      </p>
                    </div>

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
                        placeholder="Your username"
                      />
                    </div>

                    <div className="form-field">
                      <label
                        htmlFor="club"
                        className="mb-2 block text-sm font-bold text-neutral-300"
                      >
                        Club Supported
                      </label>

                      <select
                        id="club"
                        required
                        value={club}
                        onChange={(e) => setClub(e.target.value)}
                        className="h-12 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-red-500/50"
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
                        label="Email"
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
                      className="form-field group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                      <UserPlus className="h-4 w-4 transition group-hover:scale-110" />
                    </button>

                    <p className="form-field text-sm text-neutral-500">
                      Already have an account?{" "}
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => setMode("login")}
                        className="cursor-pointer font-bold text-red-400 transition hover:text-red-300"
                      >
                        Login
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
