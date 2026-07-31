"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Always lock body scroll during preloader execution
      document.body.style.overflow = "hidden";

      const panels = containerRef.current?.querySelectorAll(".preloader-panel");
      let completedEventDispatched = false;

      const dispatchComplete = () => {
        if (!completedEventDispatched) {
          completedEventDispatched = true;
          window.dispatchEvent(new Event("preloaderComplete"));
        }
      };

      const masterTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          dispatchComplete();
          setIsLoading(false);
        },
      });

      if (prefersReducedMotion) {
        masterTl
          .fromTo(logoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
          .to(logoRef.current, { opacity: 0, duration: 0.3, delay: 0.3 })
          .to(containerRef.current, { opacity: 0, duration: 0.4 }, "-=0.1");
      } else {
        masterTl
          .fromTo(
            logoRef.current,
            { opacity: 0, scale: 0.94, y: 12 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power2.out" }
          )
          .to({}, { duration: 0.35 })
          .to(logoRef.current, {
            opacity: 0,
            y: -12,
            duration: 0.35,
            ease: "power2.in",
            onComplete: () => {
              // Dispatch event right when panels begin opening so video starts from frame 0
              dispatchComplete();
            },
          })
          .to(
            panels || [],
            {
              yPercent: (index) => (index % 2 === 0 ? -100 : 100),
              duration: 0.95,
              stagger: 0.05,
              ease: "power3.inOut",
            },
            "-=0.15"
          )
          .to(
            containerRef.current,
            {
              opacity: 0,
              duration: 0.4,
              ease: "power2.inOut",
            },
            "-=0.4"
          );
      }
    },
    { scope: containerRef }
  );

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-flamingo pointer-events-auto select-none overflow-hidden"
    >
      <div className="absolute inset-0 flex w-full h-full pointer-events-none z-10">
        <div className="preloader-panel flex-1 bg-flamingo border-r border-white/10 h-full" />
        <div className="preloader-panel flex-1 bg-flamingo border-r border-white/10 h-full" />
        <div className="preloader-panel flex-1 bg-flamingo border-r border-white/10 h-full" />
        <div className="preloader-panel flex-1 bg-flamingo border-r border-white/10 h-full" />
        <div className="preloader-panel flex-1 bg-flamingo h-full" />
      </div>

      <div ref={logoRef} className="relative z-20 flex flex-col items-center justify-center p-6 text-center opacity-0">
        <div className="relative w-72 h-36 sm:w-[420px] sm:h-[210px] md:w-[540px] md:h-[270px] mb-4">
          <Image
            src="/images/logo.png"
            alt="Rima Panaroma Logo"
            fill
            priority
            className="object-contain opacity-95 drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          />
        </div>
        <p className="text-xs sm:text-sm font-switzer font-light tracking-[0.3em] text-white/90 uppercase">
          ADANA · TÜRKİYE
        </p>
      </div>
    </div>
  );
}
