"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinksLeft = [
  { name: "Karataş'ta Yaşam", href: "#" },
  { name: "Sosyal İmkanlar", href: "#" },
];

const navLinksRight = [
  { name: "Galeri", href: "#" },
  { name: "İletişim", href: "#" },
];

const allNavLinks = [...navLinksLeft, ...navLinksRight];

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      // 1. Position state: Over hero top (<= 40px) vs scrolled (> 40px)
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Visibility state:
      // - At very top of page (<= 40px): ALWAYS visible
      // - Scrolling down (scrollDelta > 5): HIDE header (-translateY-100%)
      // - Scrolling up (scrollDelta < -5): REVEAL header in cream/navy state
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (scrollDelta > 5) {
        setIsVisible(false);
      } else if (scrollDelta < -5) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    // Check initial scroll position on mount
    updateHeader();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Light top gradient overlay for nav legibility over bright hero frames */}
      <div
        className={`fixed top-0 left-0 right-0 h-36 pointer-events-none z-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
          isScrolled || !isVisible ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-400 ease-in-out transform-gpu ${
          isVisible || isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-cream/95 backdrop-blur-md border-b border-navy/10 shadow-xs py-2.5 sm:py-3.5"
            : "bg-transparent border-b border-transparent py-3 sm:py-4.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 w-full grid grid-cols-3 items-center">
          {/* LEFT ZONE: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 justify-start">
            {navLinksLeft.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-switzer font-medium text-xs lg:text-sm tracking-[0.14em] uppercase transition-all duration-300 ${
                  isScrolled
                    ? "text-navy/85 hover:text-navy [text-shadow:none]"
                    : "text-white hover:text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.9)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* MOBILE LEFT PLACEHOLDER (To keep logo perfectly centered on 3-col grid) */}
          <div className="md:hidden flex justify-start" />

          {/* CENTER ZONE: Centered Focal Logo */}
          <div className="flex items-center justify-center">
            <Link href="#" className="relative group inline-block">
              <div className="relative w-24 h-12 sm:w-28 sm:h-14 md:w-32 md:h-16 lg:w-36 lg:h-18 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={isScrolled ? "/images/logo-dark.png" : "/images/logo.png"}
                  alt="Rima Panorama Logo"
                  fill
                  priority
                  className={`object-contain transition-all duration-300 ${
                    isScrolled
                      ? "drop-shadow-none"
                      : "drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]"
                  }`}
                />
              </div>
            </Link>
          </div>

          {/* RIGHT ZONE: Navigation Links (Desktop) or Mobile Hamburger */}
          <div className="flex items-center justify-end">
            <nav className="hidden md:flex items-center gap-8 lg:gap-10 justify-end">
              {navLinksRight.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-switzer font-medium text-xs lg:text-sm tracking-[0.14em] uppercase transition-all duration-300 ${
                    isScrolled
                      ? "text-navy/85 hover:text-navy [text-shadow:none]"
                      : "text-white hover:text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.85),0_1px_4px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 focus:outline-none ${
                isScrolled
                  ? "text-navy hover:bg-navy/5"
                  : "text-white hover:bg-white/10 [text-shadow:0_1px_12px_rgba(0,0,0,0.65)]"
              }`}
            >
              <svg
                className="w-6 h-6 stroke-current drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 9h16.5m-16.5 6h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-50 bg-cream flex flex-col justify-between px-6 sm:px-12 py-8 transition-all duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Overlay Top Bar */}
        <div className="grid grid-cols-3 items-center w-full">
          <div />
          <div className="flex justify-center">
            <div className="relative w-44 h-12">
              <Image
                src="/images/logo-dark.png"
                alt="Rima Panorama Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Menüyü kapat"
              className="p-2 text-navy hover:bg-navy/5 rounded-lg focus:outline-none"
            >
              <svg
                className="w-6 h-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Overlay Links */}
        <nav className="flex flex-col items-center justify-center space-y-8 my-auto py-8">
          {allNavLinks.map((link, idx) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-switzer font-light text-xl sm:text-2xl tracking-[0.15em] uppercase text-navy hover:text-teal transition-colors duration-300"
              style={{
                transitionDelay: `${idx * 50}ms`,
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Overlay Footer Info */}
        <div className="text-center text-xs font-switzer font-light tracking-[0.25em] text-navy/60 uppercase pb-4">
          ADANA · TÜRKİYE
        </div>
      </div>
    </>
  );
}
