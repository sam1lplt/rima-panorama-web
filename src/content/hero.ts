export interface HeroContent {
  titleWords: string[];
  subline: string;
  bgImage: string;
  bgAlt: string;
  scrollCueText: string;
}

export const heroContent: HeroContent = {
  titleWords: ["KARATAŞ'TA", "DENİZLE", "BAŞLAYAN", "HAYAT"],
  subline: "Havuzlu yaşam · Denize yakın · Yatırıma değer",
  bgImage: "/images/hero-pool.jpg",
  bgAlt: "Rima Panorama havuz kompleksi ve Akdeniz gün batımı manzarası",
  scrollCueText: "↓ keşfet",
};
