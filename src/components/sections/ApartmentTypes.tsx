"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  APARTMENT_CATEGORIES,
  APARTMENT_TYPES,
  ApartmentCategory,
  ApartmentType,
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

  return (
    <section className="w-full bg-cream px-4 sm:px-8 md:px-12 py-20 border-t border-navy/10 flex flex-col items-center">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
        {/* ─── SECTION INTRO ────────────────────────────────────────────── */}
        <div className="max-w-2xl w-full mx-auto text-center flex flex-col items-center gap-4 mb-12">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-6 h-px bg-gold/60" />
            <span className="font-switzer font-medium text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gold">
              DAİRE TİPLERİ
            </span>
            <div className="w-6 h-px bg-gold/60" />
          </div>

          {/* Headline */}
          <h2 className="font-switzer font-light text-3xl sm:text-4xl md:text-5xl tracking-tight text-navy leading-snug">
            Size Uygun Daireyi Bulun
          </h2>

          {/* Description */}
          <p className="font-switzer font-light text-xs sm:text-sm md:text-base text-navy/60 max-w-lg leading-relaxed">
            Kat planlarını, metrekareleri ve alan dağılımlarını yakından
            inceleyin.
          </p>
        </div>

        {/* ─── CATEGORY TAB PILLS ───────────────────────────────────────── */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 sm:gap-3.5 mb-12">
          {APARTMENT_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full font-switzer font-medium text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 focus:outline-none cursor-pointer ${
                  isActive
                    ? "bg-navy text-white shadow-md ring-2 ring-gold/50 scale-105"
                    : "bg-cream/80 text-navy/75 border border-navy/20 hover:border-navy hover:text-navy hover:bg-cream"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ─── APARTMENT CARDS GRID ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredTypes.map((apt) => {
            const hasFailedImage = failedImages[apt.id];

            return (
              <div
                key={apt.id}
                onClick={() => setSelectedApartment(apt)}
                className="group relative rounded-2xl bg-white/70 backdrop-blur-xs border border-navy/10 hover:border-gold/60 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* Card Thumbnail / Blueprint Placeholder */}
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-[#eae3d9] via-[#f2ece3] to-[#e6ded3] overflow-hidden flex items-center justify-center p-4 border-b border-navy/5">
                  {!hasFailedImage ? (
                    <Image
                      src={apt.image}
                      alt={apt.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(apt.id)}
                    />
                  ) : (
                    /* Elegant Blueprint Spec Card Fallback if image file is missing */
                    <div className="flex flex-col items-center justify-center text-center p-4 gap-2">
                      <div className="w-12 h-12 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/60 group-hover:text-navy group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12"
                          />
                        </svg>
                      </div>
                      <span className="font-switzer font-medium text-xs text-navy/70 tracking-wider uppercase">
                        KAT PLANI
                      </span>
                      <span className="font-switzer font-light text-[10px] text-navy/40">
                        Detay için tıklayın
                      </span>
                    </div>
                  )}

                  {/* Gross m² Badge Overlay */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-lg font-switzer font-semibold text-xs tracking-wide text-navy"
                    style={{
                      background: "rgba(245, 239, 230, 0.90)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(31, 58, 95, 0.12)",
                    }}
                  >
                    {apt.grossArea}
                  </div>
                </div>

                {/* Card Info Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    {/* Apartment Name */}
                    <h3 className="font-switzer font-semibold text-lg text-navy group-hover:text-gold transition-colors duration-200">
                      {apt.name}
                    </h3>

                    {/* Metadata Line */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-navy/5 font-switzer font-medium text-[11px] text-navy/70">
                        {apt.block}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-navy/5 font-switzer font-medium text-[11px] text-navy/70">
                        {apt.floor}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gold/15 text-navy font-switzer font-medium text-[11px]">
                        {apt.count}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-navy/5 text-xs font-switzer font-medium text-navy/60 group-hover:text-navy transition-colors">
                    <span>Kat Planı & Net Alan</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200 text-gold font-bold">
                      İncele →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── APARTMENT DETAIL MODAL ─────────────────────────────────────── */}
      {selectedApartment && (
        <div
          onClick={() => setSelectedApartment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/70 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-cream border border-gold/40 shadow-2xl overflow-y-auto flex flex-col p-6 sm:p-8 md:p-10 animate-in zoom-in-95 duration-200"
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedApartment(null)}
              aria-label="Kapat"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-navy/5 text-navy/60 hover:text-navy hover:bg-navy/10 transition-colors focus:outline-none cursor-pointer z-10"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-navy/10 pr-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span className="font-switzer font-medium text-[11px] tracking-[0.2em] uppercase text-gold">
                    {selectedApartment.category} KAT PLANI DETAYLARI
                  </span>
                </div>
                <h3 className="font-switzer font-semibold text-2xl sm:text-3xl text-navy">
                  {selectedApartment.name}
                </h3>
              </div>

              {/* Gross m² Highlight */}
              <div className="flex flex-col sm:items-end">
                <span className="font-switzer font-light text-xs text-navy/60 uppercase tracking-wider">
                  BRÜT ALAN
                </span>
                <span className="font-switzer font-bold text-2xl sm:text-3xl text-navy">
                  {selectedApartment.grossArea}
                </span>
              </div>
            </div>

            {/* Meta Tags Bar */}
            <div className="flex flex-wrap items-center gap-2 py-4 border-b border-navy/5 mb-6">
              <span className="px-3 py-1 rounded-lg bg-navy/5 font-switzer font-medium text-xs text-navy">
                Blok: <strong className="text-navy">{selectedApartment.block}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-navy/5 font-switzer font-medium text-xs text-navy">
                Kat: <strong className="text-navy">{selectedApartment.floor}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-gold/15 font-switzer font-medium text-xs text-navy">
                Toplam Adet: <strong className="text-navy">{selectedApartment.count}</strong>
              </span>
            </div>

            {/* Modal Body: 2 Columns (Plan Image + Net Area Breakdown Spec List) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Floor Plan View (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#eae3d9] via-[#f2ece3] to-[#e6ded3] border border-navy/10 p-4 flex items-center justify-center overflow-hidden">
                  {!failedImages[selectedApartment.id] ? (
                    <Image
                      src={selectedApartment.image}
                      alt={selectedApartment.name}
                      fill
                      className="object-contain p-4"
                      onError={() => handleImageError(selectedApartment.id)}
                    />
                  ) : (
                    /* Large Blueprint Spec Fallback */
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy/50">
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12"
                          />
                        </svg>
                      </div>
                      <div className="font-switzer font-medium text-sm text-navy">
                        {selectedApartment.name} Mimari Kat Planı
                      </div>
                      <p className="font-switzer font-light text-xs text-navy/50 max-w-xs">
                        Görsel hazırlanıyor. Aşağıdaki listeden net alan
                        dağılımını inceleyebilirsiniz.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Net Area Breakdown Spec Sheet (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-gold/40">
                  <span className="font-switzer font-medium text-xs tracking-[0.2em] uppercase text-gold">
                    NET ALAN DAĞILIMI
                  </span>
                  <span className="font-switzer font-semibold text-xs text-navy/70">
                    SÜPÜRÜLEBİLİR NET: {calculateTotalNet(selectedApartment)}
                  </span>
                </div>

                {/* Itemized Room List */}
                <div className="flex flex-col gap-2.5 my-1">
                  {selectedApartment.netRooms.map((room, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-navy/5 hover:bg-navy/5 px-2 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2 text-navy/85 font-switzer font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold/70" />
                        <span>{room.label}</span>
                      </div>
                      <span className="font-switzer font-semibold text-navy">
                        {room.area}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-navy/5 border border-navy/10 text-[11px] font-switzer font-light text-navy/60 leading-relaxed mt-2">
                  * Belirtilen metrekareler yaklaşık değerler olup mimari
                  projedeki nihai imalat durumuna göre değişiklik gösterebilir.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
