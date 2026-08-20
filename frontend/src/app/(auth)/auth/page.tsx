"use client";

import Input from "@/components/shared/Input";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Flame, ShieldCheck, Trophy, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { login, resetSessionExpiredFlag, signup } from "@/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { profileDetail } from "@/api/services/user";
import { toast } from "sonner";

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

export default function AuthPage() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();

const updateUser = useAuthStore((state) => state.updateUser);


const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [name, setName] = useState("");
  const [club, setClub] = useState("Manchester United");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
 useEffect(() => {
    resetSessionExpiredFlag();
  }, []);
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.55,
        },
      });

      gsap.set(".auth-animate", {
        autoAlpha: 0,
        y: 18,
        force3D: true,
      });

      gsap.set(".auth-side", {
        autoAlpha: 0,
        x: -18,
        force3D: true,
      });

      tl.to(".auth-panel", { autoAlpha: 1, y: 0, duration: 0.65 })
        .to(".auth-side", { autoAlpha: 1, x: 0 }, "-=0.35")
        .to(".auth-animate", { autoAlpha: 1, y: 0, stagger: 0.06 }, "-=0.25");

      return () => tl.kill();
    },
    { scope: container },
  );

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const tween = gsap.fromTo(
        ".form-field",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
      );

      return () => tween.kill();
    },
    { scope: formRef, dependencies: [mode] },
  );

  const handleLogin = async () => {
  try {
    const [email, password] = [loginEmail, loginPassword]
    const data = await login(email, password);
    console.log('Login Data : ', data)
    console.log("Logged in:", data);

    
    const profile = await profileDetail();
    
    updateUser(profile);
    toast.success("Welcome back", {
    description: `Logged in as ${profile.name}.`,
  });
    router.push("/");
  } catch (err) {
    console.log("Login failed:", err);
  }
};
 const handleSignup = async () => {
  try {
    const [email, password] = [signupEmail, signupPassword]
    const data = await signup(email, password, name, club);
    console.log("Signed up:", data);

    
    toast.success("Account created", {
    description: "Please login to continue.",
  });
    setMode("login")
  } catch (err) {
    console.log("Sign up failed:", err);
  }
};
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

 
  setIsSubmitting(true);

  try {
    if (mode === "login") {
      await handleLogin();
    } else {
      await handleSignup();
    }
  } catch (err) {
    console.log(err);
    toast.error(mode === "login" ? "Login failed" : "Signup failed", {
      description:
        mode === "login"
          ? "Please check your email and password."
          : "Please check your details and try again.",
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
        <aside className="auth-side relative border-b border-neutral-800 bg-neutral-950 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
              <Flame className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">Bloodline</h1>
              <p className="text-sm text-neutral-500">Prediction League</p>
            </div>
          </div>

          <div className="mt-12 max-w-md">
            <p className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              <Flame className="h-4 w-4" />
              Football predictions
            </p>

            <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Predict matches and climb the table.
            </h2>

            <p className="mt-5 text-sm leading-6 text-neutral-400 sm:text-base">
              Make your score predictions, earn points, track your form, and
              compete with other football minds each week.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
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
            <div className="auth-animate mb-7 grid grid-cols-2 rounded-lg border border-neutral-800 bg-neutral-950 p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={[
                  "h-10 rounded-md text-sm font-bold transition",
                  mode === "login"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white",
                ].join(" ")}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setMode("signup")}
                className={[
                  "h-10 rounded-md text-sm font-bold transition",
                  mode === "signup"
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:text-white",
                ].join(" ")}
              >
                Sign Up
              </button>
            </div>

            <div ref={formRef}>
              {mode === "login" ? (
                <div>
                  <div className="auth-animate form-field">
                    <h2 className="text-3xl font-black tracking-tight">
                      Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Continue your prediction run.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <div className="form-field">
                      <Input
                        label="Email"
                        type="email"
                       
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <Input
                        label="Password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>

                    <button
  type="submit"
  disabled={isSubmitting}
  className="form-field group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting && mode === "login" ? "Logging in..." : "Login"}
  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
</button>
                  </form>

                  <p className="form-field mt-5 text-sm text-neutral-500">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="font-bold text-red-400 transition hover:text-red-300"
                    >
                      Create account
                    </button>
                  </p>
                </div>
              ) : (
                <div>
                  <div className="form-field">
                    <h2 className="text-3xl font-black tracking-tight">
                      Join Bloodline
                    </h2>
                    <p className="mt-2 text-sm text-neutral-500">
                      Build your predictor profile.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                    <div className="form-field">
                      <Input
                        label="Username"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-neutral-300">
                          Club Supported
                        </span>
                        <select
                          value={club}
                          onChange={(e) => setClub(e.target.value)}
                          className="h-12 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-sm text-white outline-none transition focus:border-red-500/50"
                        >
                          {clubs.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-field">
                      <Input
                        label="Email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-field">
                      <Input
                        label="Password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                    </div>

                    <button
  type="submit"
  disabled={isSubmitting}
  className="form-field group flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
>
  {isSubmitting && mode === "signup" ? "Creating account..." : "Create Account"}
  <UserPlus className="h-4 w-4 transition group-hover:scale-110" />
</button>
                    
                  </form>

                  <p className="form-field mt-5 text-sm text-neutral-500">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-bold text-red-400 transition hover:text-red-300"
                    >
                      Login
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
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
