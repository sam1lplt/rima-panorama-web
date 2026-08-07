import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import PlanIntro from "@/components/sections/PlanIntro";
import SitePlanViewer from "@/components/sections/SitePlanViewer";

export const metadata: Metadata = {
  title: "Vaziyet Planı — Rima Panorama",
  description:
    "Rima Panorama projesinin vaziyet planını keşfedin. Blokları, sosyal alanları ve site düzenini yakınlaştırarak inceleyin.",
  keywords: [
    "Rima Panorama vaziyet planı",
    "Karataş site planı",
    "Rima Panorama bloklar",
    "Adana konut projesi planı",
  ],
};

export default function PlanPage() {
  return (
    <main className="relative min-h-screen w-full bg-cream text-navy">
      <Header />
      <PlanIntro />
      <SitePlanViewer />
    </main>
  );
}
