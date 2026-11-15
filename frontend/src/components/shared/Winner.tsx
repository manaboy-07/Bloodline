"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Crown, Flame, Quote } from "lucide-react";

gsap.registerPlugin(useGSAP);

function Winner() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        ".winner-content",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
      );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="flex h-full min-h-[320px] flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-white sm:p-6"
    >
      {/* Header */}
      <div className="winner-content flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-red-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Weekly winner
          </span>
        </div>

        <span className="rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-400">
          Champion
        </span>
      </div>

      {/* Winner */}
      <div className="winner-content flex flex-1 flex-col items-center justify-center py-7 text-center">
        <div className="relative mb-4">
          <img
            src="https://assets.aceternity.com/manu.png"
            alt="Manasseh"
            className="h-24 w-24 rounded-xl border border-neutral-700 object-cover sm:h-28 sm:w-28"
          />

          <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-950">
            <Flame className="h-4 w-4 text-red-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Manasseh
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Current leader of the prediction table
        </p>
      </div>

      {/* Taunt */}
      <div className="winner-content border-t border-neutral-800 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <Quote className="h-4 w-4 text-red-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Winner's taunt
          </span>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          It can't go on like this, can it? You all need to do better.
        </p>
      </div>
    </section>
  );
}

export default Winner;
