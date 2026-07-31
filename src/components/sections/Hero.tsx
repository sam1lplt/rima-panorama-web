"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hero background video sources
const DESKTOP_VIDEO_SRC = "/videos/hero.mp4";
const MOBILE_VIDEO_SRC = ""; // Placeholder for future mobile video

// Story section video sources
const STORY_DESKTOP_VIDEO_SRC = "/videos/story.mp4";
const STORY_MOBILE_VIDEO_SRC = "/videos/story-mobile.mp4";

// Headline lines array for entrance animation
const headlineLines = ["KARATAŞ'TA", "DENİZLE", "BAŞLAYAN", "HAYAT"];

// Named Scroll Distance Constants for easy tuning
const HERO_SCATTER_SCROLL_DISTANCE = "+=1000";
const SALMON_PIN_DESKTOP = "+=2100";
const SALMON_PIN_MOBILE = "+=1500";

export default function Hero() {
  // Hero Section Refs
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroBgImgRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollCueRef = useRef<HTMLButtonElement>(null);

  // Hero Background Video State & Ref
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Story Section Video State & Ref
  const [storyVideoSrc, setStoryVideoSrc] = useState(STORY_DESKTOP_VIDEO_SRC);
  const storyVideoRef = useRef<HTMLVideoElement>(null);

  // Check screen breakpoint & reduced motion on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Enable hero video on both mobile & desktop when reduced motion is off
    if (!prefersReducedMotion && DESKTOP_VIDEO_SRC) {
      setShouldLoadVideo(true);
    }

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    // Set Story video source according to screen width
    if (isDesktop) {
      setStoryVideoSrc(STORY_DESKTOP_VIDEO_SRC);
    } else {
      setStoryVideoSrc(STORY_MOBILE_VIDEO_SRC);
    }
  }, []);

  const handleVideoCanPlay = () => {
    setIsVideoLoaded(true);
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleStoryVideoError = () => {
    // Fallback to desktop story video if mobile video is missing
    if (storyVideoSrc === STORY_MOBILE_VIDEO_SRC) {
      setStoryVideoSrc(STORY_DESKTOP_VIDEO_SRC);
    }
  };

  // Salmon Section Refs (Section 2)
  const salmonSectionRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);

  // Framing Text Refs
  const text1ARef = useRef<HTMLHeadingElement>(null);
  const text1BRef = useRef<HTMLHeadingElement>(null);

  // Initial Hero Headline Mask Reveal Animation (runs once when preloader completes)
  const startEntranceAnimation = useCallback(() => {
    if (!heroSectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lines = heroSectionRef.current.querySelectorAll(".hero-line-inner");

    if (prefersReducedMotion) {
      gsap.to(lines, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.1 });
      if (scrollCueRef.current) gsap.to(scrollCueRef.current, { opacity: 1, duration: 0.8, delay: 0.5 });
    } else {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(lines, {
        y: "0%",
        duration: 1.1,
        stagger: 0.12,
      });

      if (scrollCueRef.current) {
        tl.fromTo(
          scrollCueRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          "-=0.4"
        );
      }
    }
  }, []);

  // Responsive ScrollTrigger Setup via gsap.matchMedia()
  useGSAP(
    () => {
      let split1A: SplitType | null = null;
      let split1B: SplitType | null = null;

      if (text1ARef.current) {
        split1A = new SplitType(text1ARef.current, {
          types: "words,chars",
          wordClass: "word-1a inline-block whitespace-nowrap mr-[0.3em] last:mr-0",
          charClass:
            "char-1a inline-block transform-gpu translate-y-[110%] opacity-0 font-switzer font-light will-change-transform leading-[1.08] py-1 px-[0.5px]",
        });
      }

      if (text1BRef.current) {
        split1B = new SplitType(text1BRef.current, {
          types: "words,chars",
          wordClass: "word-1b inline-block whitespace-nowrap mr-[0.3em] last:mr-0",
          charClass:
            "char-1b inline-block transform-gpu -translate-y-[110%] opacity-0 font-switzer font-light will-change-transform leading-[1.08] py-1 px-[0.5px]",
        });
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        if (heroSectionRef.current) {
          const heroScrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: "top top",
              end: HERO_SCATTER_SCROLL_DISTANCE,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          const heroLines = heroSectionRef.current.querySelectorAll(".hero-line-inner");
          if (heroLines && heroLines.length >= 4) {
            heroScrollTl.to(heroLines[0], { x: "-12%", y: "40%", opacity: 0, ease: "none" }, 0);
            heroScrollTl.to(heroLines[1], { x: "15%", y: "40%", opacity: 0, ease: "none" }, 0);
            heroScrollTl.to(heroLines[2], { x: "-8%", y: "40%", opacity: 0, ease: "none" }, 0);
            heroScrollTl.to(heroLines[3], { x: "18%", y: "40%", opacity: 0, ease: "none" }, 0);
          }

          if (scrollCueRef.current) {
            heroScrollTl.to(scrollCueRef.current, { y: 20, opacity: 0, ease: "none" }, 0);
          }
        }

        if (salmonSectionRef.current && cardWrapperRef.current) {
          gsap.set(cardWrapperRef.current, { opacity: 0, scale: 0.96 });
          if (text1ARef.current) gsap.set(text1ARef.current, { y: 130, opacity: 0 });
          if (text1BRef.current) gsap.set(text1BRef.current, { y: -130, opacity: 0 });

          const chars1A = text1ARef.current?.querySelectorAll(".char-1a");
          const chars1B = text1BRef.current?.querySelectorAll(".char-1b");

          if (chars1A) gsap.set(chars1A, { y: "110%", opacity: 0 });
          if (chars1B) gsap.set(chars1B, { y: "-110%", opacity: 0 });

          const salmonTl = gsap.timeline({
            scrollTrigger: {
              trigger: salmonSectionRef.current,
              start: "top top",
              end: SALMON_PIN_DESKTOP,
              pin: true,
              pinSpacing: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          // 1. Video Card Band appears first
          salmonTl.to(cardWrapperRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0);

          // 2. Framing texts slide out from behind video band
          if (text1ARef.current) {
            salmonTl.to(text1ARef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
          }
          if (text1BRef.current) {
            salmonTl.to(text1BRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
          }

          if (chars1A) {
            salmonTl.to(chars1A, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.025, ease: "power4.out" }, 0.6);
          }
          if (chars1B) {
            salmonTl.to(chars1B, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.025, ease: "power4.out" }, 0.6);
          }

          // Hold view (~6 seconds viewing duration)
          salmonTl.to({}, { duration: 1.8 });

          // 3. ORDERED EXIT:
          // a. FIRST: Texts retract back BEHIND the video band
          if (text1ARef.current) {
            salmonTl.to(text1ARef.current, { y: 130, opacity: 0, duration: 0.7, ease: "power2.in" }, 2.4);
          }
          if (text1BRef.current) {
            salmonTl.to(text1BRef.current, { y: -130, opacity: 0, duration: 0.7, ease: "power2.in" }, 2.4);
          }
          if (chars1A) {
            salmonTl.to(chars1A, { y: "110%", opacity: 0, duration: 0.6, stagger: 0.015, ease: "power2.in" }, 2.4);
          }
          if (chars1B) {
            salmonTl.to(chars1B, { y: "-110%", opacity: 0, duration: 0.6, stagger: 0.015, ease: "power2.in" }, 2.4);
          }

          // b. THEN: Video band itself fades/dims out after texts are tucked away
          salmonTl.to(
            cardWrapperRef.current,
            {
              opacity: 0,
              scale: 0.96,
              duration: 0.7,
              ease: "power2.inOut",
            },
            3.1
          );
        }
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        if (heroSectionRef.current) {
          const heroMobileTl = gsap.timeline({
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: "top top",
              end: "bottom 30%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          const heroLines = heroSectionRef.current.querySelectorAll(".hero-line-inner");
          if (heroLines && heroLines.length > 0) {
            heroMobileTl.to(heroLines, { y: "-60px", opacity: 0, stagger: 0.04, ease: "none" }, 0);
          }
          if (scrollCueRef.current) {
            heroMobileTl.to(scrollCueRef.current, { y: "-20px", opacity: 0, ease: "none" }, 0);
          }
          if (heroBgImgRef.current) {
            heroMobileTl.to(heroBgImgRef.current, { scale: 1.08, ease: "none" }, 0);
          }
        }

        if (salmonSectionRef.current && cardWrapperRef.current) {
          gsap.set(cardWrapperRef.current, { opacity: 0, scale: 0.95 });
          if (text1ARef.current) gsap.set(text1ARef.current, { y: 75, opacity: 0 });
          if (text1BRef.current) gsap.set(text1BRef.current, { y: -75, opacity: 0 });

          const chars1A = text1ARef.current?.querySelectorAll(".char-1a");
          const chars1B = text1BRef.current?.querySelectorAll(".char-1b");

          if (chars1A) gsap.set(chars1A, { y: "110%", opacity: 0 });
          if (chars1B) gsap.set(chars1B, { y: "-110%", opacity: 0 });

          const mobileSalmonTl = gsap.timeline({
            scrollTrigger: {
              trigger: salmonSectionRef.current,
              start: "top top",
              end: SALMON_PIN_MOBILE,
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          // 1. Band appears first
          mobileSalmonTl.to(cardWrapperRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, 0);

          // 2. Framing texts slide out from behind band
          if (text1ARef.current) {
            mobileSalmonTl.to(text1ARef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
          }
          if (text1BRef.current) {
            mobileSalmonTl.to(text1BRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
          }

          if (chars1A) {
            mobileSalmonTl.to(chars1A, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.02, ease: "power3.out" }, 0.6);
          }
          if (chars1B) {
            mobileSalmonTl.to(chars1B, { y: "0%", opacity: 1, duration: 0.8, stagger: 0.02, ease: "power3.out" }, 0.6);
          }

          // Hold view
          mobileSalmonTl.to({}, { duration: 1.4 });

          // 3. ORDERED EXIT: Texts retract behind band first
          if (text1ARef.current) {
            mobileSalmonTl.to(text1ARef.current, { y: 75, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.7);
          }
          if (text1BRef.current) {
            mobileSalmonTl.to(text1BRef.current, { y: -75, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.7);
          }

          if (chars1A) {
            mobileSalmonTl.to(chars1A, { y: "110%", opacity: 0, duration: 0.5, stagger: 0.01, ease: "power2.in" }, 2.7);
          }
          if (chars1B) {
            mobileSalmonTl.to(chars1B, { y: "-110%", opacity: 0, duration: 0.5, stagger: 0.01, ease: "power2.in" }, 2.7);
          }

          // Then video band fades out
          mobileSalmonTl.to(cardWrapperRef.current, { opacity: 0, scale: 0.95, duration: 0.7, ease: "power2.inOut" }, 3.3);
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (cardWrapperRef.current) gsap.set(cardWrapperRef.current, { opacity: 1, scale: 1 });
        if (text1ARef.current) gsap.set(text1ARef.current, { y: 0, opacity: 1 });
        if (text1BRef.current) gsap.set(text1BRef.current, { y: 0, opacity: 1 });
        if (storyVideoRef.current) storyVideoRef.current.pause();
      });

      const handlePreloaderComplete = () => {
        if (videoRef.current) {
          try {
            videoRef.current.currentTime = 0;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setIsVideoLoaded(true);
                })
                .catch((err) => {
                  console.log("Video play error:", err);
                });
            }
          } catch (err) {
            console.log("Video play error:", err);
          }
        }
        startEntranceAnimation();
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 60);
      };

      window.addEventListener("preloaderComplete", handlePreloaderComplete);
      return () => {
        window.removeEventListener("preloaderComplete", handlePreloaderComplete);
        if (split1A) split1A.revert();
        if (split1B) split1B.revert();
      };
    },
    { scope: heroSectionRef, dependencies: [startEntranceAnimation] }
  );

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 1.2,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section
        ref={heroSectionRef}
        className="relative z-10 w-full h-[100dvh] min-h-[600px] sm:min-h-[680px] bg-black overflow-hidden flex flex-col justify-between items-center px-4 sm:px-12 pt-20 sm:pt-28 md:pt-32 pb-6 sm:pb-10 text-white select-none"
      >
        <div ref={heroBgImgRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden transform-gpu">
          {/* Poster Image: Always renders instantly */}
          <Image
            src="/images/hero-pool.jpg"
            alt="Rima Panaroma Karataş Adana pool complex"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Background Video: Plays on all screen sizes with fallback */}
          {shouldLoadVideo && (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/hero-pool.jpg"
              onCanPlay={handleVideoCanPlay}
              onLoadedData={handleVideoCanPlay}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={DESKTOP_VIDEO_SRC} type="video/mp4" />
            </video>
          )}

          {/* Light dark gradient overlay (bottom 35% dark rgba(0,0,0,0.35), top transparent) */}
          <div
            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div
          ref={textContentRef}
          className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center my-auto pt-6 sm:pt-10 pb-4 sm:pb-6 transform-gpu will-change-transform"
        >
          <h1
            ref={headlineRef}
            className="font-switzer font-light text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-[0.04em] uppercase leading-[1.05] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
          >
            {headlineLines.map((line, idx) => (
              <div key={idx} className="overflow-hidden block py-0.5">
                <span className="hero-line-inner block transform-gpu translate-y-[110%] font-switzer font-light will-change-transform [text-shadow:0_2px_20px_rgba(0,0,0,0.4)]">
                  {line}
                </span>
              </div>
            ))}
          </h1>
        </div>

        <div className="relative z-20 pb-2 flex flex-col items-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          <button
            ref={scrollCueRef}
            onClick={handleScrollDown}
            className="group flex flex-col items-center space-y-2 opacity-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-flamingo rounded-full p-2"
            aria-label="Aşağıya kaydır"
          >
            <span className="text-[11px] sm:text-sm font-switzer font-light tracking-[0.25em] uppercase text-white/90 group-hover:text-white transition-colors duration-300">
              ↓ KEŞFET
            </span>
            <div className="w-4 h-7 sm:w-5 sm:h-8 border border-white/50 group-hover:border-white rounded-full flex justify-center pt-1 transition-colors duration-300">
              <div className="w-1 h-2 bg-white/90 rounded-full animate-soft-bounce" />
            </div>
          </button>
        </div>
      </section>

      {/* BRAND STORY SECTION: LOOPING VIDEO BAND WITH FRAMING TEXTS */}
      <section
        ref={salmonSectionRef}
        className="relative z-20 w-full h-[100dvh] bg-white overflow-hidden flex flex-col justify-center items-center px-3 sm:px-6 pt-20 sm:pt-24 md:pt-28 pb-3 sm:pb-6 text-navy select-none scroll-mt-24"
      >
        {/* TOP TEXT CONTAINER (z-10, sits BEHIND the video band, overflow-visible) */}
        <div className="relative z-10 w-full max-w-none px-3 sm:px-6 md:px-8 mx-auto flex flex-col items-center justify-center pointer-events-none mb-1.5 sm:mb-3 overflow-visible">
          <div className="relative w-full flex items-center justify-center min-h-[1.18em] overflow-visible">
            <h2
              ref={text1ARef}
              className="font-switzer font-light text-[clamp(1.05rem,5.8vw,7.6rem)] tracking-[0.01em] uppercase text-navy drop-shadow-sm leading-[1.08] whitespace-nowrap opacity-0 will-change-transform text-center w-full"
            >
              ÜÇ BİN YILLIK MİRAS
            </h2>
          </div>
        </div>

        {/* WIDE HORIZONTAL VIDEO BAND (z-20, sits above top and bottom text) */}
        <div
          ref={cardWrapperRef}
          className="relative z-20 w-[95vw] sm:w-[94vw] max-w-[1550px] h-[56vh] sm:h-[62vh] max-h-[65vh] min-h-[240px] sm:min-h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform-gpu will-change-transform pointer-events-auto border border-navy/5"
        >
          <video
            ref={storyVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-pool.jpg"
            onError={handleStoryVideoError}
            onCanPlay={() => ScrollTrigger.refresh()}
            className="absolute inset-0 w-full h-full object-cover object-center transform-gpu"
          >
            <source src={storyVideoSrc} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 z-10 pointer-events-none bg-navy/10 bg-gradient-to-b from-navy/20 via-transparent to-navy/40"
            aria-hidden="true"
          />
        </div>

        {/* BOTTOM TEXT CONTAINER (z-10, sits BEHIND the video band, overflow-visible) */}
        <div className="relative z-10 w-full max-w-none px-3 sm:px-6 md:px-8 mx-auto flex flex-col items-center justify-center pointer-events-none mt-1.5 sm:mt-3 overflow-visible">
          <div className="relative w-full flex items-center justify-center min-h-[1.18em] overflow-visible">
            <h2
              ref={text1BRef}
              className="font-switzer font-light text-[clamp(0.75rem,3.8vw,4.6rem)] tracking-[0.01em] uppercase text-navy drop-shadow-sm leading-[1.08] whitespace-nowrap opacity-0 will-change-transform text-center w-full"
            >
              KARATAŞ'TA YENİDEN DOĞUYOR
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
