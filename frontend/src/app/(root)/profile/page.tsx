"use client";

import { AtSign, CalendarDays, Shield, Trophy, UserRound } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4">
        <p className="text-sm text-neutral-500">
          No profile data available. Please log in.
        </p>
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(new Date(user.createdAt))
    : "Not available";

  const points = user.points ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 text-white sm:px-6">
      {/* Profile header */}
      <section className="border-b border-neutral-800 pb-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-2xl font-bold text-red-500">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-red-500">
                {user.role?.name ?? "Predictor"}
              </span>
            </div>

            <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
              {user.name}
            </h1>

            <p className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
              <AtSign size={15} />
              {user.email}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Supporting
            </p>
            <p className="mt-1 text-base font-medium text-neutral-200">
              {user.club || "No club selected"}
            </p>
          </div>
        </div>
      </section>

      {/* Points */}
      <section className="flex items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900/50 p-5">
        <div>
          <p className="text-sm text-neutral-400">Overall points</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {points.toLocaleString()}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-red-500/10 text-red-500">
          <Trophy size={21} />
        </div>
      </section>

      {/* Profile information */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Personal information</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Your account details on Bloodline.
          </p>
        </div>

        <div className="divide-y divide-neutral-800 border-y border-neutral-800">
          <ProfileRow
            icon={UserRound}
            label="Full name"
            value={user.name || "Not available"}
          />

          <ProfileRow
            icon={AtSign}
            label="Email address"
            value={user.email || "Not available"}
          />

          <ProfileRow
            icon={Shield}
            label="Club supported"
            value={user.club || "Not selected"}
          />

          <ProfileRow
            icon={CalendarDays}
            label="Member since"
            value={joinedDate}
          />
        </div>
      </section>

      {/* Account information */}
      <section className="border-t border-neutral-800 pt-5">
        <h2 className="text-lg font-semibold">Account</h2>

        <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-neutral-500">Account ID</p>
            <p className="mt-1 break-all font-mono text-xs text-neutral-300">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-neutral-500">Account role</p>
            <p className="mt-1 text-neutral-200">
              {user.role?.name ?? "Predictor"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Icon size={18} className="shrink-0 text-neutral-500" />

      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-1 truncate text-sm font-medium text-neutral-200 sm:mt-0 sm:text-right">
          {value}
        </p>
      </div>
    </div>
  );
}
