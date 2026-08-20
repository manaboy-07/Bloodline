"use client";

import { FormEvent, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AtSign,
  Bell,
  Check,
  Lock,
  Mail,
  Save,
  Shield,
  UserRound,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateUserProfile } from "@/api/services/user";
import { toast } from "sonner";
gsap.registerPlugin(useGSAP);

const clubs = [
  "Arsenal",
  "Aston Villa",
  "Chelsea",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Newcastle United",
  "Tottenham Hotspur",
  "Barcelona",
  "Real Madrid",
  "Bayern Munich",
  "PSG",
  "Other",
];

export default function Settings() {
  const container = useRef<HTMLDivElement | null>(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser); // assume you have a setter

  // Form state – initialised from user data
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    club: user?.club || "Other",
    weeklySummary: true,
    matchReminders: true,
    publicProfile: true,
  });

  // UI states
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when user changes (e.g. after login)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        club: user.club || "Other",
      }));
    }
  }, [user]);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      const tween = gsap.fromTo(
        ".settings-animate",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        }
      );
      return () => tween.kill();
    },
    { scope: container }
  );

  const updateField = (key: keyof typeof form, value: string | boolean) => {
    setSaved(false);
    setError(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => {
    if (!user) return;
    setForm({
      name: user.name || "",
      email: user.email || "",
      club: user.club || "Other",
      weeklySummary: true, // restore default or from a preferences store
      matchReminders: true,
      publicProfile: true,
    });
    setSaved(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      // Prepare payload – only send fields that are updatable
      const payload = {
        name: form.name,
        email: form.email,
        club: form.club,
        // preferences could be sent as a separate object if needed
       
      };
    const  preferences = {
          weeklySummary: form.weeklySummary,
          matchReminders: form.matchReminders,
          publicProfile: form.publicProfile,
        }
      const updatedUser = await updateUserProfile(user.id, payload);
   
      setUser(updatedUser);

      setSaved(true);
      toast.success("Welcome back")
         
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-neutral-400">
        Please log in to access settings.
      </div>
    );
  }

  return (
    <div
      ref={container}
      className="mx-4 my-2 flex w-full max-w-[1100px] flex-col gap-5 text-white"
    >
      {/* Header */}
      <section className="settings-animate rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Update your profile and prediction preferences.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-400">
                <Check className="h-4 w-4" />
                Saved
              </div>
            )}
            {error && (
              <div className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        {/* Profile Details */}
        <section className="settings-animate rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-neutral-400">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Profile Details
              </h2>
              <p className="text-sm text-neutral-500">
                This is how you appear on the leaderboard.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Field label="Display Name" icon={UserRound}>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="field-input"
                placeholder="Your name"
                disabled={loading}
              />
            </Field>

            <Field label="Email Address" icon={Mail}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="field-input"
                placeholder="name@email.com"
                disabled={loading}
              />
            </Field>

            <Field label="Club Supported" icon={Shield}>
              <select
                value={form.club}
                onChange={(e) => updateField("club", e.target.value)}
                className="field-input"
                disabled={loading}
              >
                {clubs.map((club) => (
                  <option key={club} value={club} className="bg-neutral-950">
                    {club}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-animate rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-950 text-neutral-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Preferences</h2>
              <p className="text-sm text-neutral-500">
                Control updates and profile visibility.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ToggleRow
              title="Match reminders"
              description="Get reminded before prediction deadlines."
              checked={form.matchReminders}
              onChange={(value) => updateField("matchReminders", value)}
              disabled={loading}
            />

            <ToggleRow
              title="Weekly summary"
              description="Receive your points and rank movement each week."
              checked={form.weeklySummary}
              onChange={(value) => updateField("weeklySummary", value)}
              disabled={loading}
            />

            <ToggleRow
              title="Public profile"
              description="Let other predictors view your club and stats."
              checked={form.publicProfile}
              onChange={(value) => updateField("publicProfile", value)}
              disabled={loading}
            />
          </div>

          <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-300">
              <Lock className="h-4 w-4 text-neutral-500" />
              Account note
            </div>
            <p className="text-sm leading-6 text-neutral-500">
              Email changes may require verification before they appear on your
              account.
            </p>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-700 px-4 text-sm font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-white disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}


function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-neutral-300">
        <Icon className="h-4 w-4 text-neutral-500" />
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 transition ${
        disabled ? "opacity-60" : "hover:border-neutral-700"
      }`}
    >
      <span>
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="mt-1 block text-sm leading-5 text-neutral-500">
          {description}
        </span>
      </span>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span className="block h-6 w-11 rounded-full bg-neutral-700 transition-colors peer-checked:bg-red-600" />
        <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
}