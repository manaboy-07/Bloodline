"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface AppLoaderProps {
  onComplete: () => void;
}

const splatters = [
  { x: -40, y: -18 },
  { x: 44, y: -14 },
  { x: -18, y: -48 },
  { x: 26, y: -42 },
  { x: -56, y: -6 },
  { x: 58, y: -8 },
];

export default function AppLoader({ onComplete }: AppLoaderProps) {
  const container = useRef<HTMLDivElement>(null);
  const completed = useRef(false);
  const callback = useRef(onComplete);

  callback.current = onComplete;

  useGSAP(
    () => {
      const root = container.current;
      if (!root) return;

      const finish = () => {
        if (completed.current) return;

        completed.current = true;
        callback.current();
      };

      const elements = {
        drop: root.querySelector(".blood-drop"),
        text: root.querySelector(".blood-text"),
        rings: root.querySelectorAll(".blood-ring"),
        splatters: root.querySelectorAll(".splatter"),
      };

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        const call = gsap.delayedCall(0.2, finish);
        return () => call.kill();
      }

      gsap.set(elements.drop, {
        y: -180,
        scaleY: 0.5,
        scaleX: 1,
        autoAlpha: 0,
        transformOrigin: "center bottom",
      });

      gsap.set(elements.text, {
        y: 20,
        autoAlpha: 0,
      });

      gsap.set(elements.rings, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "center center",
      });

      gsap.set(elements.splatters, {
        scale: 0,
        autoAlpha: 0,
      });

      const timeline = gsap.timeline({
        onComplete: finish,
      });

      timeline
        .to(elements.drop, {
          y: 0,
          autoAlpha: 1,
          scaleY: 1,
          duration: 0.65,
          ease: "power4.in",
        })
        .to(
          elements.drop,
          {
            scaleX: 2.2,
            scaleY: 0.22,
            duration: 0.14,
            ease: "power3.out",
          },
          "-=0.04",
        )
        .to(
          elements.rings[0],
          {
            scale: 3.2,
            autoAlpha: 0,
            duration: 0.55,
            ease: "expo.out",
          },
          "<",
        )
        .to(
          elements.rings[1],
          {
            scale: 2.4,
            autoAlpha: 0,
            duration: 0.5,
            ease: "expo.out",
          },
          "<+=0.07",
        )
        .to(
          elements.splatters,
          {
            scale: 1,
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.025,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          elements.drop,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.65,
            ease: "elastic.out(1, 0.48)",
          },
          "-=0.42",
        )
        .to(
          elements.text,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power4.out",
          },
          "-=0.3",
        )
        .to(root, {
          autoAlpha: 0,
          duration: 0.45,
          delay: 0.45,
          ease: "power3.inOut",
        });

      return () => {
        timeline.kill();
      };
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
      aria-label="Loading Bloodline"
      role="status"
    >
      <div className="absolute h-[480px] w-[480px] rounded-full bg-red-700/10 blur-[96px]" />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="blood-ring absolute h-20 w-20 rounded-full border-2 border-red-500/50" />
          <div className="blood-ring absolute h-16 w-16 rounded-full border border-red-400/30" />

          <div className="blood-drop" style={{ width: 42, height: 58 }}>
            <svg
              viewBox="0 0 42 58"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full overflow-visible"
            >
              <path
                d="M21 2 C21 2, 40 24, 40 36 C40 47.6 31.6 56 21 56 C10.4 56 2 47.6 2 36 C2 24 21 2 21 2 Z"
                fill="#dc2626"
              />
              <ellipse
                cx="15"
                cy="26"
                rx="5"
                ry="7"
                fill="rgba(255,255,255,0.18)"
              />
            </svg>
          </div>

          {splatters.map((s, index) => (
            <div
              key={index}
              className="splatter absolute h-2 w-2 rounded-full bg-red-600"
              style={{
                transform: `translate(${s.x}px, ${s.y}px)`,
              }}
            />
          ))}
        </div>

        <div className="blood-text select-none text-center">
          <h1 className="bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
            Bloodline
          </h1>

          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.45em] text-red-500/55 sm:text-xs">
            Prediction League
          </p>
        </div>
      </div>
    </div>
  );
}
