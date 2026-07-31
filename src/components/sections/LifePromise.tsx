"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// NAMED CONSTANTS — tune these freely to adjust timing and speeds
const SCRUB_SMOOTHNESS = 1;            // Lag (s) on scroll→horizontal motion (scrub: 1 for smooth easing)
const INTRO_HOLD_DISTANCE = 2000;      // Vertical scroll distance (px) the intro stays pinned before horizontal movement starts
const DESKTOP_PIN_SCROLL_DISTANCE = 800; // Total vertical scroll distance (px) for horizontal translation itself (halved again)

interface LifePanelData {
  id: number;
  number: string;
  word: string;
  sentence: string;
  image: string;
  fallbackImage: string;
}

const panelsData: LifePanelData[] = [
  {
    id: 1,
    number: "01",
    word: "HUZUR",
    sentence:
      "Kesintisiz deniz manzarası ve bakımlı yeşil alanlarla, şehrin gürültüsünden uzak bir dinginlik.",
    image: "/images/yasam-huzur.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    number: "02",
    word: "GÜVENLİK",
    sentence:
      "7/24 güvenlik ve profesyonel site yönetimiyle, aileniz her an güvende.",
    image: "/images/yasam-guvenlik.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    number: "03",
    word: "SOSYAL YAŞAM",
    sentence:
      "Havuzlar, sosyal alanlar ve planlı aktivitelerle komşuluğun ve paylaşmanın merkezinde.",
    image: "/images/yasam-sosyal.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 4,
    number: "04",
    word: "AİLE",
    sentence:
      "Çocuk oyun alanları, güvenli bahçeler ve birlikte biriktirilecek anılarla ailece bir yaşam.",
    image: "/images/yasam-aile.jpg",
    fallbackImage:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function LifePromise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const introEyebrowRef = useRef<HTMLDivElement>(null);
  const introHeadlineRef = useRef<HTMLHeadingElement>(null);

  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelNumberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelWordRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const panelSentenceRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageLoad = () => {
    ScrollTrigger.refresh();
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ─── DESKTOP: horizontal scroll with intro hold ─────────────────────────────
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const container = containerRef.current;
          if (!track || !container) return;

          gsap.set(track, { x: 0 });

          const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

          // ── GSAP Timeline: pin the section and scrub track horizontally ────────
          const mainTl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              pin: true,
              pinSpacing: true,
              scrub: SCRUB_SMOOTHNESS,
              start: "top top",
              end: () => `+=${INTRO_HOLD_DISTANCE + DESKTOP_PIN_SCROLL_DISTANCE}`,
              invalidateOnRefresh: true,
            },
          });

          // Phase 1: Hold the intro static on screen
          mainTl.to({}, { duration: INTRO_HOLD_DISTANCE });

          // Phase 2: Translate the track horizontally
          mainTl.to(track, {
            x: getScrollAmount,
            ease: "none",
            duration: DESKTOP_PIN_SCROLL_DISTANCE
          });

          // Sync progress bar only during horizontal translation
          if (progressBarRef.current) {
            mainTl.to(
              progressBarRef.current,
              {
                scaleX: 1,
                ease: "none",
                duration: DESKTOP_PIN_SCROLL_DISTANCE,
              },
              INTRO_HOLD_DISTANCE
            );
          }

          // ── Intro text entrance ────────────────────────────────────────────────
          if (introEyebrowRef.current) {
            gsap.fromTo(introEyebrowRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
          }
          if (introHeadlineRef.current) {
            gsap.fromTo(introHeadlineRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "power3.out" }
            );
          }

          // ── Per-panel Ken Burns + text reveals (containerAnimation = mainTl) ──
          panelRefs.current.forEach((panel, idx) => {
            if (!panel) return;
            const imgContainer = panelImgRefs.current[idx];
            const numEl = panelNumberRefs.current[idx];
            const wordEl = panelWordRefs.current[idx];
            const sentenceEl = panelSentenceRefs.current[idx];

            if (imgContainer) {
              gsap.fromTo(imgContainer, { scale: 1 }, {
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: mainTl,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              });
            }

            const revealTl = gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                containerAnimation: mainTl,
                start: "left 80%",
                end: "center center",
                toggleActions: "play none none reverse",
              },
            });

            if (numEl) {
              revealTl.fromTo(numEl,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
              );
            }
            if (wordEl) {
              revealTl.fromTo(wordEl,
                { opacity: 0, y: 35, clipPath: "inset(100% 0 0 0)" },
                { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "power3.out" },
                "-=0.3"
              );
            }
            if (sentenceEl) {
              revealTl.fromTo(sentenceEl,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
                "-=0.4"
              );
            }
          });
        }
      );

      // ─── MOBILE VERTICAL STACK ─────────────────────────────────────────────────
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        mobileCardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(card,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );
        });
      });

      // ─── REDUCED MOTION ─────────────────────────────────────────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        panelRefs.current.forEach((p) => p && gsap.set(p, { opacity: 1 }));
      });

      const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(timer);
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#F5EFE6] text-[#1F3A5F] select-none overflow-hidden"
    >
      {/* ─── DESKTOP HORIZONTAL PINNED TRACK ──────────────────────────────────── */}
      <div className="hidden md:flex flex-col justify-between h-screen w-full relative py-6">
        {/* Top brand tag */}
        <div className="w-full flex items-center justify-between z-30 pt-2 px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <span className="w-8 h-[2px] bg-gold rounded-full inline-block" />
            <span className="text-xs lg:text-sm font-switzer font-medium tracking-[0.25em] uppercase text-gold">
              RİMA'DA YAŞAM
            </span>
          </div>
          <span className="text-xs font-switzer font-light tracking-widest text-[#1F3A5F]/50 uppercase">
            [ KAYDIRIN ]
          </span>
        </div>

        {/* Scrolling track — each panel is exactly 100vw wide */}
        <div className="relative w-full flex-1 overflow-hidden flex items-center">
          <div
            ref={trackRef}
            className="flex h-[80vh] w-max items-stretch will-change-transform"
          >
            {/* Panel 0: Intro (100vw) */}
            <div className="w-screen h-full flex-shrink-0 flex flex-col justify-center px-16 lg:px-28">
              <div ref={introEyebrowRef} className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-gold rounded-full inline-block" />
                <span className="text-sm font-switzer font-medium tracking-[0.25em] uppercase text-gold">
                  RİMA'DA YAŞAM
                </span>
              </div>
              <h2
                ref={introHeadlineRef}
                className="font-switzer font-light text-5xl lg:text-7xl text-[#1F3A5F] leading-[1.1] max-w-3xl"
              >
                Siz Keyfini Çıkarın,{" "}
                <span className="italic font-serif text-[#1F3A5F]/75">
                  Detayları Biz Düşündük
                </span>
              </h2>
            </div>

            {/* Panels 1–4: each exactly 100vw */}
            {panelsData.map((panel, idx) => {
              const isFailed = failedImages[panel.id];
              const imgSrc = isFailed ? panel.fallbackImage : panel.image;

              return (
                <div
                  key={panel.id}
                  ref={(el) => { panelRefs.current[idx] = el; }}
                  className="w-screen h-full flex-shrink-0 px-6 lg:px-10 py-2"
                >
                  <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl border border-[#1F3A5F]/10 bg-black/40">
                    {/* Ken Burns wrapper */}
                    <div
                      ref={(el) => { panelImgRefs.current[idx] = el; }}
                      className="absolute inset-0 w-full h-full z-0 transform-gpu will-change-transform"
                    >
                      <Image
                        src={imgSrc}
                        alt={panel.word}
                        fill
                        sizes="100vw"
                        quality={90}
                        onLoad={handleImageLoad}
                        onError={() => handleImageError(panel.id)}
                        className="object-cover object-center brightness-[0.85]"
                      />
                      <div
                        className="absolute inset-0 z-10 bg-gradient-to-t from-[#1F3A5F] via-[#1F3A5F]/60 to-transparent"
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text overlay */}
                    <div className="relative z-20 h-full w-full p-10 lg:p-16 flex flex-col justify-end">
                      <div
                        ref={(el) => { panelNumberRefs.current[idx] = el; }}
                        className="flex items-center gap-3 mb-2"
                      >
                        <span className="text-gold font-mono font-semibold tracking-widest text-sm">
                          {panel.number}
                        </span>
                        <span className="w-8 h-[1px] bg-gold/50 inline-block" />
                      </div>

                      <h3
                        ref={(el) => { panelWordRefs.current[idx] = el; }}
                        className="font-switzer font-light text-4xl lg:text-7xl uppercase tracking-[0.04em] text-white drop-shadow-lg mb-4"
                      >
                        {panel.word}
                      </h3>

                      <p
                        ref={(el) => { panelSentenceRefs.current[idx] = el; }}
                        className="font-switzer font-light text-base lg:text-xl text-cream/90 leading-relaxed max-w-2xl drop-shadow"
                      >
                        {panel.sentence}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gold progress bar */}
        <div className="w-full px-8 lg:px-12 pb-2 z-30">
          <div className="relative w-full h-[2px] bg-[#1F3A5F]/15 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute inset-0 bg-gold origin-left scale-x-0 h-full transform-gpu"
            />
          </div>
        </div>
      </div>

      {/* ─── MOBILE VERTICAL STACK ────────────────────────────────────────────── */}
      <div className="md:hidden py-16 px-6 flex flex-col gap-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-gold rounded-full inline-block" />
            <span className="text-xs font-switzer font-medium tracking-[0.25em] uppercase text-gold">
              RİMA'DA YAŞAM
            </span>
          </div>
          <h2 className="font-switzer font-light text-3xl sm:text-4xl text-[#1F3A5F] leading-tight">
            Siz Keyfini Çıkarın,{" "}
            <span className="italic font-serif text-[#1F3A5F]/75">Detayları Biz Düşündük</span>
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          {panelsData.map((panel, idx) => {
            const isFailed = failedImages[panel.id];
            const imgSrc = isFailed ? panel.fallbackImage : panel.image;

            return (
              <div
                key={panel.id}
                ref={(el) => { mobileCardRefs.current[idx] = el; }}
                className="relative w-full aspect-[4/5] min-h-[420px] rounded-2xl overflow-hidden bg-black/40 shadow-xl border border-[#1F3A5F]/10 flex flex-col justify-end p-6"
              >
                <div className="absolute inset-0 w-full h-full z-0">
                  <Image
                    src={imgSrc}
                    alt={panel.word}
                    fill
                    sizes="100vw"
                    quality={85}
                    onError={() => handleImageError(panel.id)}
                    className="object-cover object-center brightness-[0.85]"
                  />
                  <div
                    className="absolute inset-0 z-10 bg-gradient-to-t from-[#1F3A5F] via-[#1F3A5F]/60 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="relative z-20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-mono text-xs tracking-widest font-semibold">
                      {panel.number}
                    </span>
                    <span className="w-4 h-[1px] bg-gold/60 inline-block" />
                  </div>
                  <h3 className="font-switzer font-light text-2xl uppercase tracking-[0.04em] text-white">
                    {panel.word}
                  </h3>
                  <p className="font-switzer font-light text-sm text-cream/90 leading-relaxed">
                    {panel.sentence}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
