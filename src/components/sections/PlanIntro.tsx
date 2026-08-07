"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PlanIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const lines = containerRef.current.querySelectorAll(".plan-line-inner");
      const subtitle = containerRef.current.querySelector(".plan-subtitle");

      if (prefersReducedMotion) {
        // Simple fades only
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.1 }
        );
        gsap.fromTo(
          lines,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.2, stagger: 0.08 }
        );
        gsap.fromTo(
          subtitle,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.45 }
        );
        gsap.fromTo(
          scrollCueRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, delay: 0.65 }
        );
        return;
      }

      // Full mask/line-reveal entrance — same pattern as the rest of the site
      const tl = gsap.timeline({ delay: 0.15 });

      // Eyebrow fades up
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      // Headline lines slide up from mask
      tl.to(
        lines,
        {
          y: "0%",
          duration: 1.0,
          stagger: 0.13,
          ease: "power4.out",
        },
        "-=0.45"
      );

      // Subtitle fades in
      tl.fromTo(
        subtitle,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.55"
      );

      // Scroll cue
      tl.fromTo(
        scrollCueRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-cream flex flex-col items-center justify-center pt-32 pb-20 sm:pt-40 sm:pb-24 px-6 sm:px-12 overflow-hidden"
    >
      {/* Subtle top decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-gold/30 pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center gap-6">
        {/* Gold eyebrow */}
        <div
          ref={eyebrowRef}
          className="opacity-0 font-switzer font-medium text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold"
        >
          RİMA PANORAMA · VAZİYET PLANI
        </div>

        {/* Headline — mask reveal */}
        <h1 className="font-switzer font-light text-4xl sm:text-5xl md:text-6xl tracking-tight text-navy leading-[1.05] overflow-hidden">
          {/* Each word is in its own mask wrapper so the line-inner slides up from hidden */}
          <span className="block overflow-hidden">
            <span
              className="plan-line-inner block"
              style={{ transform: "translateY(110%)" }}
            >
              Projeyi
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="plan-line-inner block"
              style={{ transform: "translateY(110%)" }}
            >
              Keşfedin
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="plan-subtitle opacity-0 font-switzer font-light text-sm sm:text-base text-navy/60 leading-relaxed max-w-md mx-auto">
          Sosyal alanları ve blokları yakından inceleyin. Tam ekranda gezinin,
          yakınlaştırın.
        </p>

        {/* Gold divider */}
        <div className="w-8 h-px bg-gold/50 mt-2" />
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="opacity-0 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span className="font-switzer font-light text-[10px] tracking-[0.22em] uppercase text-navy/40">
          keşfet
        </span>
        <svg
          className="w-4 h-4 text-navy/40 animate-soft-bounce"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 3v10M3.5 8.5l4.5 4.5 4.5-4.5"
          />
        </svg>
      </div>
    </section>
  );
}
