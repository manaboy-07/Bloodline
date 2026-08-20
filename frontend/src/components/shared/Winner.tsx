"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Crown, Flame, Quote, Shield } from "lucide-react";

gsap.registerPlugin(useGSAP);

function Winner() {
  const container = useRef<HTMLDivElement | null>(null);

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

      gsap.set(".winner-animate", {
        autoAlpha: 0,
        y: 16,
        force3D: true,
      });

      gsap.set(".winner-avatar", {
        autoAlpha: 0,
        scale: 0.86,
        rotate: -4,
        force3D: true,
      });

      tl.to(".winner-animate", {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
      }).to(
        ".winner-avatar",
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          stagger: 0.08,
          ease: "back.out(1.7)",
        },
        "-=0.35",
      );

      gsap.to(".winner-crown", {
        y: -5,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut",
      });

      return () => {
        tl.kill();
      };
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-xl bg-neutral-900 text-white"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:px-6">
        <div className="winner-animate mb-4 inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-red-400">
          <Crown className="h-4 w-4" />
          Weekly Winner
        </div>

        <div className="winner-animate relative mb-5">
          <div className="winner-crown absolute -top-7 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-yellow-500/10 p-2 text-yellow-400">
            <Crown className="h-5 w-5" />
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="winner-avatar relative">
              <img
                src="https://assets.aceternity.com/manu.png"
                className="h-24 w-24 rounded-2xl border border-red-500/30 object-cover shadow-2xl shadow-red-500/20 sm:h-28 sm:w-28"
                alt="Manasseh"
              />
              <div className="absolute -bottom-2 -right-2 rounded-lg border border-neutral-800 bg-neutral-950 p-2">
                <Flame className="h-4 w-4 text-red-500" />
              </div>
            </div>

            <div className="winner-avatar hidden h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950 text-neutral-400 sm:flex">
              <Shield className="h-7 w-7" />
            </div>
          </div>
        </div>

        <div className="winner-animate">
          <h2 className="text-3xl font-black tracking-tight text-white">
            Manasseh
          </h2>
          <p className="mt-1 text-sm font-medium text-neutral-500">
            Current king of the prediction table
          </p>
        </div>

        <div className="winner-animate mt-6 w-full rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-left">
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-300">
            <Quote className="h-4 w-4 text-red-400" />
            Winner&apos;s taunt
          </div>

          <p className="text-sm leading-6 text-neutral-400">
            It can&apos;t go on like this, can it? You all need to do better.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Winner;
