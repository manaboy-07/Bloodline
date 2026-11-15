"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Mail, Shield, UserRound, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";
import { updateUserProfile } from "@/api/services/user";

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

type ProfileForm = {
  name: string;
  email: string;
  club: string;
};

const getInitialForm = (user: {
  name?: string | null;
  email?: string | null;
  club?: string | null;
}): ProfileForm => ({
  name: user.name ?? "",
  email: user.email ?? "",
  club: user.club || "Other",
});

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    email: "",
    club: "Other",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setForm(getInitialForm(user));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
        Please log in to access settings.
      </div>
    );
  }

  const originalForm = getInitialForm(user);

  const isDirty =
    form.name !== originalForm.name ||
    form.email !== originalForm.email ||
    form.club !== originalForm.club;

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setError(null);
  };

  const resetForm = () => {
    setForm(getInitialForm(user));
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || loading || !isDirty) return;

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(user.id, {
        name,
        email,
        club: form.club,
      });

      setUser(updatedUser);
      setForm(getInitialForm(updatedUser));

      toast.success("Profile updated successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update your profile. Please try again.";

      setError(message);
      toast.error("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 text-white sm:px-6">
      {/* Header */}
      <section className="border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

        <p className="mt-1 text-sm text-neutral-500">
          Manage your account information.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1fr_280px]"
      >
        {/* Profile form */}
        <section className="min-w-0">
          <div className="mb-5">
            <h2 className="text-base font-semibold">Profile information</h2>
            <p className="mt-1 text-sm text-neutral-500">
              These details are used on your Bloodline account.
            </p>
          </div>

          <div className="space-y-5">
            <FormField label="Display name" icon={UserRound}>
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
                disabled={loading}
                className="settings-input"
              />
            </FormField>

            <FormField label="Email address" icon={Mail}>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                disabled={loading}
                className="settings-input"
              />
            </FormField>

            <FormField label="Club supported" icon={Shield}>
              <select
                value={form.club}
                onChange={(event) => updateField("club", event.target.value)}
                disabled={loading}
                className="settings-input"
              >
                {clubs.map((club) => (
                  <option key={club} value={club} className="bg-neutral-950">
                    {club}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {error && (
            <p role="alert" className="mt-5 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-neutral-800 pt-5">
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Save size={16} />
              )}

              {loading ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading || !isDirty}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-800 px-4 text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </section>

        {/* Account information */}
        <aside className="h-fit border-t border-neutral-800 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h2 className="text-base font-semibold">Account information</h2>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-neutral-500">Account role</p>
              <p className="mt-1 text-sm text-neutral-200">
                {user.role?.name ?? "Predictor"}
              </p>
            </div>

            <div>
              <p className="text-xs text-neutral-500">Account ID</p>
              <p className="mt-1 break-all font-mono text-xs text-neutral-300">
                {user.id}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-800 pt-4">
            <p className="text-xs leading-5 text-neutral-500">
              Changes to your profile are saved to your account. Email changes
              may require additional verification depending on your account
              configuration.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function FormField({
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
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-300">
        <Icon size={16} className="text-neutral-500" />
        {label}
      </span>

      {children}
    </label>
  );
}
