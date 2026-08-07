"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  APARTMENT_CATEGORIES,
  APARTMENT_TYPES,
  ApartmentCategory,
  ApartmentType,
  NetRoom,
} from "@/content/apartmentTypes";

export default function ApartmentTypes() {
  const [activeCategory, setActiveCategory] =
    useState<ApartmentCategory>("1+1");
  const [selectedApartment, setSelectedApartment] =
    useState<ApartmentType | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Filter types by active category
  const filteredTypes = APARTMENT_TYPES.filter(
    (apt) => apt.category === activeCategory
  );

  // Handle broken / missing image fallback
  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // Close modal on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedApartment) {
        setSelectedApartment(null);
      }
    },
    [selectedApartment]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedApartment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedApartment]);

  // Calculate sum of net area for modal
  const calculateTotalNet = (apt: ApartmentType): string => {
    const total = apt.netRooms.reduce((acc, room) => {
      const val = parseFloat(room.area.replace(" m²", "").replace(",", "."));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    return total.toFixed(2) + " m²";
  };

  // Helper: Find index of largest room in netRooms for editorial focal point
  const getLargestRoomIndex = (rooms: NetRoom[]): number => {
    let maxVal = -1;
    let maxIdx = 0;
    rooms.forEach((room, idx) => {
      const val = parseFloat(room.area.replace(" m²", "").replace(",", "."));
      if (!isNaN(val) && val > maxVal) {
        maxVal = val;
        maxIdx = idx;
      }
    });
    return maxIdx;
  };

  return (
    <section className="w-full bg-cream px-4 sm:px-8 md:px-12 pt-20 pb-16 select-none">
      <div className="max-w-7xl w-full mx-auto">
        {/* ─── EDITORIAL MAGAZINE SECTION HEADER ──────────────────────── */}
        <div className="flex flex-col gap-3.5 mb-14 max-w-2xl text-left">
          {/* Quiet minimal label */}
          <span className="font-switzer font-medium text-xs tracking-[0.25em] uppercase text-gold">
            DAİRE TİPLERİ
          </span>

          {/* Confident Large Headline with Flamingo Accent */}
          <h2 className="font-switzer font-light text-4xl sm:text-5xl md:text-6xl text-navy leading-[1.1] tracking-tight">
            Size Uygun{" "}
            <span className="relative inline-block font-normal">
              Daireyi
              <span className="absolute bottom-1.5 left-0 right-0 h-[3px] bg-[#E8836F]" />
            </span>{" "}
            Bulun
          </h2>

          {/* Connected Subhead */}
          <p className="font-switzer font-light text-sm sm:text-base text-navy/60 leading-relaxed mt-1">
            Kat planlarını, metrekarelerini ve alan dağılımlarını inceleyin.
          </p>
        </div>

        {/* ─── FLAT ARCHITECTURAL TAB BAR ─────────────────────────────── */}
        <div className="flex items-center gap-6 sm:gap-10 border-b border-navy/15 mb-10 overflow-x-auto no-scrollbar">
          {APARTMENT_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`pb-3.5 font-switzer text-xs sm:text-sm tracking-[0.22em] uppercase transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? "font-semibold text-navy"
                    : "font-light text-navy/40 hover:text-navy/80"
                }`}
              >
                {category}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-navy" />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── ARCHITECTURAL SPEC CARDS GRID ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredTypes.map((apt) => {
            const hasFailedImage = failedImages[apt.id];

            return (
              <div
                key={apt.id}
                onClick={() => setSelectedApartment(apt)}
                className="group relative rounded-none bg-white border border-navy/15 hover:border-navy/50 transition-all duration-200 hover:-translate-y-0.5 flex flex-col cursor-pointer overflow-hidden shadow-none"
              >
                {/* Card Top: Flat Light Panel */}
                <div className="relative w-full aspect-[4/3] bg-[#F7F4EE] border-b border-navy/10 p-4 flex items-center justify-center overflow-hidden">
                  {!hasFailedImage ? (
                    <Image
                      src={apt.image}
                      alt={apt.name}
                      fill
                      className="object-contain p-3 group-hover:scale-[1.02] transition-transform duration-300"
                      onError={() => handleImageError(apt.id)}
                    />
                  ) : (
                    /* Architectural Blueprint Spec Fallback */
                    <div className="flex flex-col items-center justify-center text-center p-4 gap-2 w-full h-full border border-dashed border-navy/20 bg-[#FAF7F2]">
                      <span className="font-switzer font-medium text-[11px] text-navy/80 tracking-[0.22em] uppercase">
                        {apt.name}
                      </span>
                      <span className="font-switzer font-light text-[10px] text-navy/40 tracking-wider">
                        MİMARİ KAT PLANI
                      </span>
                    </div>
                  )}

                  {/* Gross Area Spec Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 border border-navy/15 font-switzer font-semibold text-xs tracking-wide text-navy shadow-none">
                    {apt.grossArea}
                  </div>
                </div>

                {/* Card Bottom: Editorial Spec Metadata */}
                <div className="p-5 flex flex-col justify-between flex-1 gap-4 bg-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-switzer font-medium text-lg text-navy">
                        {apt.name}
                      </h3>
                      <span className="font-switzer font-light text-xs text-navy/50">
                        {apt.grossArea}
                      </span>
                    </div>

                    {/* Quieter Architectural Spec Lines */}
                    <div className="mt-3 pt-3 border-t border-navy/10 flex flex-col gap-1 text-[11px] font-switzer font-light text-navy/60">
                      <div className="flex items-center justify-between">
                        <span className="uppercase tracking-wider text-navy/40 text-[10px]">Blok</span>
                        <span className="font-medium text-navy/80">{apt.block}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="uppercase tracking-wider text-navy/40 text-[10px]">Kat</span>
                        <span className="font-medium text-navy/80">{apt.floor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="uppercase tracking-wider text-navy/40 text-[10px]">Adet</span>
                        <span className="font-medium text-navy/80">{apt.count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-3 border-t border-navy/10 flex items-center justify-between text-[11px] font-switzer font-medium tracking-[0.18em] uppercase text-gold">
                    <span>İncele</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── MAGAZINE-SPREAD ARCHITECTURAL DETAIL MODAL ─────────────────── */}
      {selectedApartment && (
        <div
          onClick={() => setSelectedApartment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-navy/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[92vh] rounded-none bg-[#FDFBF7] text-navy border border-navy/20 shadow-2xl overflow-y-auto p-6 sm:p-10 md:p-12 flex flex-col gap-8 animate-in zoom-in-95 duration-200"
          >
            {/* Minimal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedApartment(null)}
              aria-label="Kapat"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center border border-navy/15 text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors focus:outline-none cursor-pointer z-20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ─── EDITORIAL SPREAD TOP HEADER ───────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-navy/15 pr-12">
              <div className="flex flex-col gap-2">
                {/* Category & Accent Tag */}
                <div className="flex items-center gap-3">
                  <span className="w-6 h-px bg-gold" />
                  <span className="font-switzer font-medium text-xs tracking-[0.25em] uppercase text-gold">
                    {selectedApartment.category}
                  </span>
                </div>

                {/* Large Hero Title */}
                <h3 className="font-switzer font-light text-4xl sm:text-5xl md:text-6xl text-navy tracking-tight leading-none">
                  {selectedApartment.name}
                </h3>

                {/* Single Quiet Inline Meta Line */}
                <p className="font-switzer font-light text-xs sm:text-sm text-navy/65 mt-1.5 flex items-center gap-2">
                  <span>{selectedApartment.block}</span>
                  <span className="text-gold">&middot;</span>
                  <span>{selectedApartment.floor}</span>
                  <span className="text-gold">&middot;</span>
                  <span className="font-medium text-navy/90">{selectedApartment.count}</span>
                </p>
              </div>

              {/* Big Editorial m² Typography */}
              <div className="flex flex-col md:items-end gap-0.5">
                <span className="font-switzer font-light text-[10px] sm:text-xs text-navy/40 uppercase tracking-[0.2em]">
                  BRÜT ALAN
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-cinzel font-bold text-4xl sm:text-5xl md:text-6xl text-navy tracking-tight">
                    {selectedApartment.grossArea.replace(" m²", "")}
                  </span>
                  <span className="font-switzer font-medium text-lg sm:text-xl text-gold">
                    m²
                  </span>
                </div>
              </div>
            </div>

            {/* ─── EDITORIAL TWO-COLUMN SPREAD (60% Plan / 40% Spec Info) ──── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* LEFT: Dominant Floor-Plan Viewer (7 Cols ~ 58%) */}
              <div className="lg:col-span-7 flex flex-col w-full">
                <div className="relative w-full aspect-[4/3] bg-[#F4F0E8] border border-navy/15 p-4 sm:p-6 flex items-center justify-center overflow-hidden rounded-none">
                  {!failedImages[selectedApartment.id] ? (
                    <Image
                      src={selectedApartment.image}
                      alt={selectedApartment.name}
                      fill
                      className="object-contain p-4"
                      onError={() => handleImageError(selectedApartment.id)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-3 w-full h-full border border-dashed border-navy/20 bg-[#F8F5EE]">
                      <span className="font-switzer font-medium text-sm text-navy tracking-[0.25em] uppercase">
                        {selectedApartment.name}
                      </span>
                      <span className="font-switzer font-light text-xs text-navy/50 tracking-wider">
                        MİMARİ KAT PLANI GÖRSELİ
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Left-Aligned Editorial Spec Info Stack (5 Cols ~ 42%) */}
              <div className="lg:col-span-5 flex flex-col gap-5 w-full text-left">
                {/* Section Heading */}
                <div className="flex items-center justify-between pb-3 border-b border-navy/15">
                  <span className="font-switzer font-medium text-xs tracking-[0.25em] uppercase text-navy">
                    NET ALAN DAĞILIMI
                  </span>
                  <span className="font-switzer font-light text-[11px] uppercase tracking-wider text-navy/50">
                    [ ODALAR ]
                  </span>
                </div>

                {/* Room Breakdown List with Flamingo Accent on Largest Space */}
                <div className="flex flex-col gap-1">
                  {selectedApartment.netRooms.map((room, idx) => {
                    const isLargest = idx === getLargestRoomIndex(selectedApartment.netRooms);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between py-2 text-xs sm:text-sm transition-colors ${
                          isLargest
                            ? "border-l-2 border-[#E8836F] bg-[#E8836F]/5 pl-3 pr-2 font-medium"
                            : "pl-1 pr-1 border-b border-navy/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-navy">
                          <span>{room.label}</span>
                          {isLargest && (
                            <span className="text-[9px] font-switzer font-semibold uppercase tracking-wider text-[#E8836F] bg-[#E8836F]/10 px-1.5 py-0.5">
                              EN GENİŞ ALAN
                            </span>
                          )}
                        </div>
                        <span className="font-switzer font-semibold text-navy tabular-nums">
                          {room.area}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bolder Summary Line */}
                <div className="pt-4 border-t border-navy/20 flex items-center justify-between">
                  <span className="font-switzer font-medium text-xs tracking-[0.18em] uppercase text-navy">
                    TOPLAM SÜPÜRÜLEBİLİR NET
                  </span>
                  <span className="font-cinzel font-bold text-lg text-gold">
                    {calculateTotalNet(selectedApartment)}
                  </span>
                </div>

                {/* Quiet Disclaimer */}
                <p className="text-[10px] font-switzer font-light text-navy/40 leading-relaxed pt-2">
                  * Belirtilen metrekareler yaklaşık değerler olup mimari projedeki nihai imalat durumuna göre değişiklik gösterebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
