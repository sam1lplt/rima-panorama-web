"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Scene {
  id: number;
  image: string;
  fallbackImage: string;
  eyebrow: string;
  title: string;
  text: string;
  gradient: string;
}

const scenes: Scene[] = [
  {
    id: 1,
    image: "/images/karatas-akyatan.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop",
    eyebrow: "01 — DOĞAL YAŞAM",
    title: "Akyatan Lagünü",
    text: "Sadece 10 kilometre ötede, flamingoların ve caretta carettaların yuvası Türkiye'nin en büyük lagünü sizi bekliyor.",
    gradient: "from-[#1F3A5F] via-[#3E8A8C] to-[#E8836F]",
  },
  {
    id: 2,
    image: "/images/karatas-magarsus.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop",
    eyebrow: "02 — TARİH",
    title: "Magarsus Antik Tiyatrosu",
    text: "Denize karşı yükselen Roma dönemi antik kenti ve amfitiyatrosu, binlerce yıllık bir hikâyeyi kıyıya taşıyor.",
    gradient: "from-[#112236] via-[#1F3A5F] to-[#C9A24B]",
  },
  {
    id: 3,
    image: "/images/karatas-sahil.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    eyebrow: "03 — DENİZ",
    title: "Karataş Sahili",
    text: "Türkiye'nin sayılı uzun kumsallarından biri; ince kumu ve sığ, berrak suyuyla ailece güvenle denize girilen bir kıyı.",
    gradient: "from-[#3E8A8C] via-[#1F3A5F] to-[#F5EFE6]",
  },
];

export default function KaratasLife() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const sceneBgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sceneTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  useGSAP(
    () => {
      // 1. Intro Section Reveal Animation
      if (introRef.current) {
        const introElements = introRef.current.querySelectorAll(".intro-animate");
        gsap.fromTo(
          introElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Desktop Pinned Scenes Crossfade
      if (pinnedRef.current) {
        const mm = gsap.matchMedia();

        // DESKTOP ONLY: Pinned scroll sequence
        mm.add(
          "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          () => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: pinnedRef.current,
                start: "top top",
                end: "+=2400",
                pin: true,
                pinSpacing: true,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });

            sceneBgRefs.current.forEach((bg, idx) => {
              if (!bg) return;
              gsap.set(bg, { opacity: idx === 0 ? 1 : 0, scale: idx === 0 ? 1 : 1.08 });
            });

            sceneTextRefs.current.forEach((txt, idx) => {
              if (!txt) return;
              gsap.set(txt, { opacity: idx === 0 ? 1 : 0, y: idx === 0 ? 0 : 40 });
            });

            const totalTransitions = scenes.length - 1;
            const stepDuration = 1.2;

            for (let i = 0; i < totalTransitions; i++) {
              const currentBg = sceneBgRefs.current[i];
              const nextBg = sceneBgRefs.current[i + 1];
              const currentText = sceneTextRefs.current[i];
              const nextText = sceneTextRefs.current[i + 1];

              const startTime = i * stepDuration * 2;

              if (currentText) {
                tl.to(
                  currentText,
                  { opacity: 0, y: -30, duration: stepDuration * 0.6, ease: "power2.in" },
                  startTime
                );
              }

              if (nextBg) {
                tl.to(
                  nextBg,
                  { opacity: 1, scale: 1, duration: stepDuration, ease: "power2.inOut" },
                  startTime + 0.2
                );
              }

              if (currentBg) {
                tl.to(
                  currentBg,
                  { opacity: 0, duration: stepDuration, ease: "power2.inOut" },
                  startTime + 0.2
                );
              }

              if (nextText) {
                tl.to(
                  nextText,
                  { opacity: 1, y: 0, duration: stepDuration * 0.7, ease: "power3.out" },
                  startTime + stepDuration * 0.7
                );
              }

              tl.to({}, { duration: stepDuration * 0.8 });
            }
          }
        );

        // MOBILE ONLY: Simple vertical card fade reveals (jank-free native scroll)
        mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
          mobileCardRefs.current.forEach((card) => {
            if (!card) return;
            gsap.fromTo(
              card,
              { opacity: 0, y: 40, scale: 0.96 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          });
        });

        // REDUCED MOTION FALLBACK
        mm.add("(prefers-reduced-motion: reduce)", () => {
          sceneBgRefs.current.forEach((bg, idx) => {
            if (bg) gsap.set(bg, { opacity: idx === 0 ? 1 : 0 });
          });
          sceneTextRefs.current.forEach((txt, idx) => {
            if (txt) gsap.set(txt, { opacity: idx === 0 ? 1 : 0, y: 0 });
          });
        });

        ScrollTrigger.refresh();
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative w-full bg-cream text-navy select-none">
      {/* 1. INTRO SECTION */}
      <div
        ref={introRef}
        className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-32 flex flex-col items-start justify-center"
      >
        <div className="space-y-4 max-w-3xl">
          <div className="intro-animate flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gold rounded-full inline-block" />
            <span className="text-xs sm:text-sm font-switzer font-medium tracking-[0.25em] uppercase text-teal">
              KARATAŞ'TA YAŞAM
            </span>
          </div>

          <h2 className="intro-animate font-switzer font-light text-3xl sm:text-5xl md:text-6xl tracking-[0.02em] text-navy leading-[1.12]">
            Sadece Bir Ev Değil, Bir Coğrafya
          </h2>

          <p className="intro-animate text-base sm:text-lg md:text-xl font-switzer font-light text-navy/80 leading-relaxed pt-2">
            Rima Panorama'nın kapısından çıktığınızda sizi Akdeniz'in en
            dokunulmamış kıyılarından biri karşılıyor.
          </p>
        </div>
      </div>

      {/* 2. DESKTOP PINNED CINEMATIC SCENES */}
      <div
        ref={pinnedRef}
        className="hidden md:block relative w-full h-[100dvh] bg-black overflow-hidden"
      >
        {scenes.map((scene, idx) => {
          const isFailed = failedImages[scene.id];
          const imgSrc = isFailed ? scene.fallbackImage : scene.image;

          return (
            <div
              key={scene.id}
              ref={(el) => {
                sceneBgRefs.current[idx] = el;
              }}
              className="absolute inset-0 w-full h-full transform-gpu will-change-transform"
            >
              <div className="relative w-full h-full">
                <Image
                  src={imgSrc}
                  alt={scene.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  onError={() => handleImageError(scene.id)}
                  className="object-cover object-center"
                />
                <div
                  className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div
                ref={(el) => {
                  sceneTextRefs.current[idx] = el;
                }}
                className="absolute bottom-12 sm:bottom-16 md:bottom-24 left-0 right-0 z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 pointer-events-auto transform-gpu will-change-transform"
              >
                <div className="max-w-3xl space-y-3 sm:space-y-4">
                  <div className="text-xs sm:text-sm font-switzer font-medium tracking-[0.25em] uppercase text-gold">
                    {scene.eyebrow}
                  </div>
                  <h3 className="font-switzer font-light text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.02em] uppercase text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)] leading-tight">
                    {scene.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg font-switzer font-light text-white/90 leading-relaxed max-w-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] pt-1">
                    {scene.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MOBILE SCENES (Vertical Card Stack for Smooth Native Touch Scroll) */}
      <div className="md:hidden flex flex-col gap-8 px-5 pb-16">
        {scenes.map((scene, idx) => {
          const isFailed = failedImages[scene.id];
          const imgSrc = isFailed ? scene.fallbackImage : scene.image;

          return (
            <div
              key={scene.id}
              ref={(el) => {
                mobileCardRefs.current[idx] = el;
              }}
              className="relative w-full aspect-[4/5] min-h-[440px] rounded-2xl overflow-hidden shadow-xl border border-navy/10 bg-black flex flex-col justify-end p-6"
            >
              <div className="absolute inset-0 w-full h-full z-0">
                <Image
                  src={imgSrc}
                  alt={scene.title}
                  fill
                  sizes="100vw"
                  onError={() => handleImageError(scene.id)}
                  className="object-cover object-center brightness-[0.85]"
                />
                <div
                  className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-20 space-y-2">
                <span className="text-gold font-mono text-xs tracking-widest font-semibold block">
                  {scene.eyebrow}
                </span>
                <h3 className="font-switzer font-light text-2xl uppercase tracking-[0.02em] text-white">
                  {scene.title}
                </h3>
                <p className="font-switzer font-light text-sm text-white/90 leading-relaxed">
                  {scene.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
