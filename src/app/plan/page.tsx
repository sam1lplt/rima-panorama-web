import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import PlanIntro from "@/components/sections/PlanIntro";
import SitePlanViewer from "@/components/sections/SitePlanViewer";
import ApartmentTypes from "@/components/sections/ApartmentTypes";

export const metadata: Metadata = {
  title: "Vaziyet Planı & Daire Tipleri — Rima Panorama",
  description:
    "Rima Panorama projesinin vaziyet planını ve 1+1, 2+1, 3+1 ve 4+1 dubleks daire tiplerini inceleyin. Kat planları, metrekareler ve net alan dağılımları.",
  keywords: [
    "Rima Panorama vaziyet planı",
    "Karataş site planı",
    "Rima Panorama daire tipleri",
    "Karataş 1+1 2+1 3+1 daireler",
    "Adana konut projesi kat planları",
  ],
};

export default function PlanPage() {
  return (
    <main className="relative min-h-screen w-full bg-cream text-navy">
      <Header />
      <PlanIntro />
      <SitePlanViewer />
      <ApartmentTypes />
    </main>
  );
}
