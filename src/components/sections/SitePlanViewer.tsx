"use client";

import { useRef, useEffect, useState, useCallback } from "react";

// ─── Amenity Pin Interface & Data ─────────────────────────────────────────────
export interface Amenity {
  id: number;
  number: number;
  name: string;
  description: string;
  x: number; // percentage coordinate across SVG width (0-100)
  y: number; // percentage coordinate down SVG height (0-100)
}

export const AMENITIES: Amenity[] = [
  {
    id: 1,
    number: 1,
    name: "Adult Havuz",
    description: "Yetişkinlere özel, sakin ve dingin bir yüzme havuzu.",
    x: 50,
    y: 58,
  },
  {
    id: 2,
    number: 2,
    name: "İşyeri",
    description: "Proje içi ticari ve alışveriş alanları.",
    x: 57,
    y: 70,
  },
  {
    id: 3,
    number: 3,
    name: "Havuz",
    description: "Açık ve ferah ana yüzme havuzu.",
    x: 62,
    y: 75,
  },
  {
    id: 4,
    number: 4,
    name: "Sahil Konseptli Havuz",
    description: "Denize sıfır hissi veren, geniş sahil konseptli ana havuz.",
    x: 57,
    y: 44,
  },
  {
    id: 5,
    number: 5,
    name: "Aquapark Alanı",
    description: "Renkli su kaydıraklarıyla eğlence ve macera bölgesi.",
    x: 48,
    y: 44,
  },
  {
    id: 6,
    number: 6,
    name: "Çocuk Havuzu",
    description: "Çocuklar için sığ, güvenli ve keyifli yüzme havuzu.",
    x: 54,
    y: 32,
  },
  {
    id: 7,
    number: 7,
    name: "Shuttle Bekleme Alanı",
    description: "Sahil shuttle servisi konforlu bekleme noktası.",
    x: 43,
    y: 48,
  },
  {
    id: 8,
    number: 8,
    name: "Sosyal Çim Alan",
    description: "Piknik, yürüyüş ve dinlenme için geniş yeşil çim alanı.",
    x: 44,
    y: 34,
  },
  {
    id: 9,
    number: 9,
    name: "Aquapark Alanı",
    description: "İkinci aquapark ve alternatif su oyun bölgesi.",
    x: 56,
    y: 54,
  },
  {
    id: 10,
    number: 10,
    name: "Spor Sahası",
    description: "Basketbol ve çok amaçlı açık spor alanı.",
    x: 50,
    y: 54,
  },
  {
    id: 11,
    number: 11,
    name: "Havuz Bar",
    description: "Havuz başı serinletici içecek ve dinlenme barı.",
    x: 58,
    y: 29,
  },
  {
    id: 12,
    number: 12,
    name: "Restaurant Bar",
    description: "Günün her saati lezzetli tatlar sunan restoran ve bar.",
    x: 51,
    y: 61,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SCALE = 5;
const ZOOM_FACTOR = 0.12; // fraction of scale per wheel tick
const SCALE_STEP = 0.5;   // ＋/－ button step

interface Transform {
  scale: number;
  x: number;
  y: number;
}

// ─── Utility: clamp pan ───────────────────────────────────────────────────────
function clampPan(
  x: number,
  y: number,
  scale: number,
  containerW: number,
  containerH: number
): { x: number; y: number } {
  const GUARD = 80;
  const minX = GUARD - scale * containerW;
  const maxX = containerW - GUARD;
  const minY = GUARD - scale * containerH;
  const maxY = containerH - GUARD;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

const FIT: Transform = { scale: 1, x: 0, y: 0 };

export default function SitePlanViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState<Transform>(FIT);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Active selected amenity pin for info panel
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  // Pointer position tracking to distinguish pin clicks from map drags
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Track drag state
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  }>({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });

  // Track pinch state
  const pinchRef = useRef<{
    active: boolean;
    lastDist: number;
    lastScale: number;
  }>({ active: false, lastDist: 0, lastScale: 1 });

  // ── Get container dimensions ───────────────────────────────────────────────
  const getContainerRect = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { w: window.innerWidth, h: window.innerHeight };
    const r = el.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }, []);

  // ── Apply transform ────────────────────────────────────────────────────────
  const applyTransform = useCallback(
    (next: Transform) => {
      const { w, h } = getContainerRect();
      const clamped = clampPan(next.x, next.y, next.scale, w, h);
      const final = { scale: next.scale, x: clamped.x, y: clamped.y };
      setTransform(final);
      if (wrapperRef.current) {
        wrapperRef.current.style.transform =
          `translate(${final.x}px, ${final.y}px) scale(${final.scale})`;
      }
    },
    [getContainerRect]
  );

  // ── Reset to full-fit view ─────────────────────────────────────────────────
  const resetToFit = useCallback(() => {
    setTransform(FIT);
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = "translate(0px, 0px) scale(1)";
    }
  }, []);

  useEffect(() => {
    resetToFit();
  }, [resetToFit]);

  // ── Fade-in on scroll into view ────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Track fullscreen changes ───────────────────────────────────────────────
  useEffect(() => {
    const onFsChange = () => {
      const entering = !!document.fullscreenElement;
      setIsFullscreen(entering);
      if (!entering) document.body.style.overflow = "";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resetToFit();
        });
      });
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [resetToFit]);

  // ── Zoom helper ────────────────────────────────────────────────────────────
  const zoomAt = useCallback(
    (cx: number, cy: number, delta: number) => {
      const t = transformRef.current;
      const newScale = Math.min(MAX_SCALE, Math.max(1, t.scale * (1 + delta)));
      const scaleFactor = newScale / t.scale;

      const newX = cx - scaleFactor * (cx - t.x);
      const newY = cy - scaleFactor * (cy - t.y);

      applyTransform({ scale: newScale, x: newX, y: newY });
    },
    [applyTransform]
  );

  // ── Mouse wheel zoom ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const raw = e.deltaY || e.deltaX;
      const delta = -Math.sign(raw) * ZOOM_FACTOR;
      zoomAt(cx, cy, delta);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // ── Mouse drag pan ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        originX: transformRef.current.x,
        originY: transformRef.current.y,
      };
      setIsInteracting(true);
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      applyTransform({
        scale: transformRef.current.scale,
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
    };

    const onMouseUp = () => {
      dragRef.current.active = false;
      setIsInteracting(false);
      el.style.cursor = "grab";
      el.style.userSelect = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.style.cursor = "grab";

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [applyTransform]);

  // ── Touch pan + pinch zoom ────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getTouchDist = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const getMidpoint = (t1: Touch, t2: Touch, rect: DOMRect) => ({
      x: (t1.clientX + t2.clientX) / 2 - rect.left,
      y: (t1.clientY + t2.clientY) / 2 - rect.top,
    });

    const onTouchStart = (e: TouchEvent) => {
      setIsInteracting(true);
      if (e.touches.length === 1) {
        pointerStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        dragRef.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          originX: transformRef.current.x,
          originY: transformRef.current.y,
        };
        pinchRef.current.active = false;
      } else if (e.touches.length === 2) {
        dragRef.current.active = false;
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        pinchRef.current = {
          active: true,
          lastDist: dist,
          lastScale: transformRef.current.scale,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();

      if (e.touches.length === 1 && dragRef.current.active) {
        const dx = e.touches[0].clientX - dragRef.current.startX;
        const dy = e.touches[0].clientY - dragRef.current.startY;
        applyTransform({
          scale: transformRef.current.scale,
          x: dragRef.current.originX + dx,
          y: dragRef.current.originY + dy,
        });
      } else if (e.touches.length === 2 && pinchRef.current.active) {
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const mid = getMidpoint(e.touches[0], e.touches[1], rect);
        const scaleDelta = dist / pinchRef.current.lastDist - 1;
        pinchRef.current.lastDist = dist;
        zoomAt(mid.x, mid.y, scaleDelta * 1.4);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current.active = false;
      if (e.touches.length === 0) {
        dragRef.current.active = false;
        setIsInteracting(false);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [applyTransform, zoomAt]);

  // ── Pin Click Handler with Drag Protection ────────────────────────────────
  const handlePinClick = (e: React.MouseEvent, amenity: Amenity) => {
    e.stopPropagation();
    const dist = Math.hypot(
      e.clientX - pointerStartRef.current.x,
      e.clientY - pointerStartRef.current.y
    );
    // Ignore as pin click if mouse moved during pan drag (> 6px)
    if (dist > 6) return;

    setSelectedAmenity((prev) => (prev?.id === amenity.id ? null : amenity));
  };

  // ── Dismiss Panel on Map Background Click ─────────────────────────────────
  const handleContainerClick = (e: React.MouseEvent) => {
    const dist = Math.hypot(
      e.clientX - pointerStartRef.current.x,
      e.clientY - pointerStartRef.current.y
    );
    if (dist <= 6 && selectedAmenity) {
      setSelectedAmenity(null);
    }
  };

  // ── Button Zoom Controls ──────────────────────────────────────────────────
  const handleZoomIn = () => {
    const { w, h } = getContainerRect();
    zoomAt(w / 2, h / 2, SCALE_STEP / transformRef.current.scale);
  };

  const handleZoomOut = () => {
    const { w, h } = getContainerRect();
    zoomAt(w / 2, h / 2, -SCALE_STEP / transformRef.current.scale);
  };

  const handleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        document.body.style.overflow = "hidden";
      } else {
        await document.exitFullscreen();
        document.body.style.overflow = "";
      }
    } catch {
      // Fullscreen not supported
    }
  };

  const roundedScale = Math.round(transform.scale * 10) / 10;

  return (
    <section className="w-full bg-cream px-4 sm:px-8 md:px-12 pb-20 pt-2 flex flex-col items-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
        {/* Section label */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-6 h-px bg-gold/60" />
          <span className="font-switzer font-medium text-[10px] tracking-[0.28em] uppercase text-navy/50">
            VAZİYET PLANI
          </span>
          <div className="w-6 h-px bg-gold/60" />
        </div>

        {/* Plan Container */}
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          role="img"
          aria-label="Rima Panorama vaziyet planı — yakınlaştırıp gezinebileceğiniz etkileşimli harita"
          className={`relative w-full h-[480px] sm:h-[600px] lg:h-[700px] overflow-hidden border border-navy/12 shadow-[0_8px_48px_rgba(31,58,95,0.10)] ${
            isFullscreen ? "" : "rounded-2xl"
          }`}
          style={{
            background: isFullscreen
              ? "#1a3050"
              : "linear-gradient(135deg, #eae3d9 0%, #f0e9df 100%)",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
            height: isFullscreen ? "100vh" : undefined,
            width: isFullscreen ? "100vw" : "100%",
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            display: isFullscreen ? "flex" : undefined,
            alignItems: isFullscreen ? "center" : undefined,
            justifyContent: isFullscreen ? "center" : undefined,
          }}
        >
          {/* ── Image & Pins Transform Wrapper ─────────────────────────── */}
          <div
            ref={wrapperRef}
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "0 0",
              willChange: "transform",
              transition: isInteracting
                ? "none"
                : "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Aspect Ratio Bounding Canvas matching SVG (1190.25 × 842.25) */}
            <div
              className="relative"
              style={{
                aspectRatio: "1190.25 / 842.25",
                width: "100%",
                height: "100%",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            >
              {/* SVG Map Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/plan.svg"
                alt="Rima Panorama vaziyet planı"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                  pointerEvents: "none",
                }}
              />

              {/* ── LAYER 2: Amenity Pin Overlay Markers ──────────────── */}
              {AMENITIES.map((pin) => {
                const isSelected = selectedAmenity?.id === pin.id;
                // Inverse scale factor so pins stay compact and don't grow huge on map zoom
                const pinScale = 1 / Math.pow(transform.scale, 0.85);

                return (
                  <div
                    key={pin.id}
                    className="absolute group z-10"
                    style={{
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                      transform: `translate(-50%, -50%) scale(${pinScale})`,
                      transformOrigin: "center center",
                      transition: isInteracting ? "none" : "transform 0.15s ease-out",
                    }}
                  >
                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 whitespace-nowrap transform group-hover:-translate-y-0.5">
                      <div className="px-2.5 py-1 rounded-lg bg-navy/95 text-white text-[11px] font-switzer font-medium shadow-lg border border-gold/40 flex items-center gap-1.5 backdrop-blur-xs">
                        <span className="text-gold font-bold">{pin.number}.</span>
                        <span>{pin.name}</span>
                      </div>
                      {/* Tooltip caret */}
                      <div className="w-2 h-2 bg-navy/95 rotate-45 mx-auto -mt-1 border-r border-b border-gold/40" />
                    </div>

                    {/* Pin Button */}
                    <button
                      type="button"
                      onClick={(e) => handlePinClick(e, pin)}
                      aria-label={`${pin.number}. ${pin.name}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-switzer font-bold text-xs transition-all duration-200 focus:outline-none cursor-pointer ${
                        isSelected
                          ? "bg-gold text-navy shadow-xl scale-110 ring-4 ring-gold/40 z-20"
                          : "bg-navy text-white hover:bg-gold hover:text-navy hover:scale-110 hover:ring-4 hover:ring-gold/30 shadow-md"
                      }`}
                    >
                      {pin.number}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Info Panel (Active Amenity Card / Bottom Sheet) ───────── */}
          {selectedAmenity && (
            <div
              className={`z-30 transition-all duration-300 pointer-events-auto ${
                isFullscreen
                  ? "fixed bottom-6 right-6 max-w-sm w-[calc(100%-3rem)] sm:w-80"
                  : "absolute bottom-4 right-4 max-w-sm w-[calc(100%-2rem)] sm:w-80"
              }`}
            >
              <div
                className="relative rounded-2xl p-5 sm:p-6 shadow-2xl border border-gold/40 bg-cream/95 backdrop-blur-md text-navy flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
                style={{ boxShadow: "0 12px 40px rgba(31, 58, 95, 0.22)" }}
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedAmenity(null)}
                  aria-label="Kapat"
                  className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-full bg-navy/5 text-navy/60 hover:text-navy hover:bg-navy/10 transition-colors focus:outline-none cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Eyebrow */}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span className="font-switzer font-medium text-[10px] tracking-[0.2em] uppercase text-gold">
                    {String(selectedAmenity.number).padStart(2, "0")} &middot; SOSYAL DONATI
                  </span>
                </div>

                {/* Amenity Title */}
                <h3 className="font-switzer font-semibold text-lg sm:text-xl text-navy pr-6 leading-snug">
                  {selectedAmenity.name}
                </h3>

                {/* Amenity Description */}
                <p className="font-switzer font-light text-xs sm:text-sm text-navy/75 leading-relaxed mt-0.5">
                  {selectedAmenity.description}
                </p>
              </div>
            </div>
          )}

          {/* ── Top-right: Scale Badge + Fullscreen Button ────────────── */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
            {/* Scale badge */}
            <div
              className="hidden sm:flex items-center px-2.5 py-1 rounded-lg font-switzer font-medium text-[10px] tracking-[0.18em] uppercase text-navy/60"
              style={{ background: "rgba(245,239,230,0.88)", backdropFilter: "blur(8px)" }}
            >
              {roundedScale}×
            </div>

            <button
              type="button"
              onClick={handleFullscreen}
              aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran görünümü aç"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-switzer font-medium text-xs tracking-[0.12em] text-navy/80 transition-all duration-200 hover:text-navy active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 cursor-pointer"
              style={{
                background: "rgba(245,239,230,0.92)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(31,58,95,0.12)",
                boxShadow: "0 2px 12px rgba(31,58,95,0.08)",
              }}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Kapat</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span>Tam Ekran</span>
                </>
              )}
            </button>
          </div>

          {/* ── Bottom-right: Zoom Controls ───────────────────────────── */}
          <div
            className="absolute bottom-3 right-3 z-20 flex items-center gap-1 pointer-events-auto"
            style={{
              background: "rgba(245,239,230,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: "1px solid rgba(31,58,95,0.12)",
              boxShadow: "0 2px 12px rgba(31,58,95,0.08)",
            }}
          >
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Yakınlaştır"
              className="w-9 h-9 flex items-center justify-center text-navy/70 hover:text-navy transition-colors duration-150 rounded-l-xl active:scale-90 focus:outline-none cursor-pointer"
              style={{ fontSize: "18px", fontWeight: 300 }}
            >
              ＋
            </button>
            <div className="w-px h-5 bg-navy/10" />
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Uzaklaştır"
              className="w-9 h-9 flex items-center justify-center text-navy/70 hover:text-navy transition-colors duration-150 active:scale-90 focus:outline-none cursor-pointer"
              style={{ fontSize: "18px", fontWeight: 300 }}
            >
              －
            </button>
            <div className="w-px h-5 bg-navy/10" />
            <button
              type="button"
              onClick={resetToFit}
              aria-label="Tüm planı göster (sıfırla)"
              className="w-9 h-9 flex items-center justify-center text-navy/70 hover:text-navy transition-colors duration-150 rounded-r-xl active:scale-90 focus:outline-none cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* ── Bottom-left: Usage Hint (desktop only) ────────────────── */}
          <div
            className="absolute bottom-3 left-3 z-20 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl font-switzer font-light text-[10px] tracking-[0.18em] uppercase text-navy/45"
            style={{
              background: "rgba(245,239,230,0.78)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(31,58,95,0.08)",
              pointerEvents: "none",
            }}
          >
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v8M8 12h8" />
            </svg>
            Noktalara tıklayın &middot; Sürükleyip yakınlaştırın
          </div>
        </div>

        {/* Below-plan note */}
        <p className="mt-4 text-center font-switzer font-light text-xs text-navy/40 tracking-wide">
          Sosyal alan detaylarını incelemek için numaralı noktalara tıklayın. Planı sürükleyip yakınlaştırabilirsiniz.
        </p>
      </div>
    </section>
  );
}
