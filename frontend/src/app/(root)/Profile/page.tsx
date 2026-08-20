"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  AtSign,
  CalendarDays,
  Flame,
  Medal,
  Shield,
  Trophy,
  UserRound,
} from "lucide-react";

import { User, useAuthStore } from "@/store/useAuthStore";
import { profileDetail } from "@/api/services/user";

gsap.registerPlugin(useGSAP);

export default function ProfilePage() {
  const container = useRef<HTMLDivElement | null>(null);

  const user = useAuthStore((state) => state.user);

  
  const [profile, setProfile] = useState<User | null>(user);
  
  

  
  useGSAP(
    () => {
      if (!profile) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const tween = gsap.fromTo(
        ".profile-animate",
        {
          autoAlpha: 0,
          y: 16,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "opacity,visibility,transform",
        },
      );

      return () => tween.kill();
    },
    { scope: container, dependencies: [profile] },
  );

  const joinedDate = useMemo(() => {
    if (!profile?.createdAt) return "Not available";

    return new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
    }).format(new Date(profile.createdAt));
  }, [profile?.createdAt]);

 

  

  if (!profile) {
    return (
      <div className="mx-4 my-2 flex w-full max-w-[1200px] text-white">
        <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <p className="text-sm font-bold text-neutral-400">
            No profile data available.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Overall Points",
      value: profile.points ?? 0,
      icon: Trophy,
      accent: "text-red-400 bg-red-500/10",
    },
    {
      label: "Weekly Points",
      value: 0,
      icon: Flame,
      accent: "text-emerald-400 bg-emerald-500/10",
    },
    {
      label: "Current Rank",
      value: "N/A",
      icon: Medal,
      accent: "text-amber-400 bg-amber-500/10",
    },
  ];

  return (
    <div
      ref={container}
      className="mx-4 my-2 flex w-full max-w-[1200px] flex-col gap-5 text-white"
    >
      <section className="profile-animate rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-neutral-950 text-3xl font-black text-red-400">
              {profile.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-red-400">
                <Shield className="h-3.5 w-3.5" />
                {profile.role?.name ?? "Predictor"}
              </div>

              <h1 className="truncate text-3xl font-black tracking-tight sm:text-4xl">
                {profile.name}
              </h1>

              <p className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
                <AtSign className="h-4 w-4 text-neutral-500" />
                {profile.email}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Supports
            </p>
            <p className="mt-1 text-lg font-black text-white">
              {profile.club || "Not selected"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="profile-animate rounded-xl border border-neutral-800 bg-neutral-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-neutral-400">{stat.label}</p>
                  <h2 className="mt-3 text-4xl font-black">{stat.value}</h2>
                </div>

                <div className={`rounded-lg p-3 ${stat.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <div className="profile-animate rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="text-xl font-black tracking-tight">
            Predictor Details
          </h2>

          <div className="mt-5 divide-y divide-neutral-800">
            <ProfileRow icon={UserRound} label="Name" value={profile.name} />
            <ProfileRow icon={AtSign} label="Email" value={profile.email} />
            <ProfileRow
              icon={Shield}
              label="Club Supported"
              value={profile.club || "Not selected"}
            />
            <ProfileRow
              icon={CalendarDays}
              label="Joined"
              value={joinedDate}
            />
          </div>
        </div>

        <div className="profile-animate rounded-xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="text-xl font-black tracking-tight">Account Record</h2>

          <div className="mt-5 grid gap-3">
            <RecordItem label="Role" value={profile.role?.name ?? "Predictor"} />
            <RecordItem label="Points" value={profile.points ?? 0} />
            <RecordItem label="User ID" value={profile.id} />
          </div>

          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-300">Current form</p>
            <p className="mt-1 text-sm leading-6 text-neutral-400">
              Your profile is active. Start making predictions to climb the
              table.
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
    <div className="flex items-center gap-3 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-950 text-neutral-400">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function RecordItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950/50 px-4 py-3">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-sm font-black text-white">{value}</p>
    </div>
  );
}