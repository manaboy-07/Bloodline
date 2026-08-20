"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
};

export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion || !ref.current) {
        gsap.set(ref.current, { autoAlpha: 1, y: 0 });
        return;
      }

      const tween = gsap.fromTo(
        ref.current,
        {
          autoAlpha: 0,
          y: 18,
          scale: 0.995,
          filter: "blur(6px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
          clearProps: "transform,filter",
        },
      );

      return () => {
        tween.kill();
      };
    },
    { scope: ref },
  );

  return (
    <section className={`min-w-0 ${className}`} ref={ref}>
      {children}
    </section>
  );
}
