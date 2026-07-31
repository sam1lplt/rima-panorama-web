import Preloader from "@/components/ui/Preloader";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import KaratasLife from "@/components/sections/KaratasLife";
import LifePromise from "@/components/sections/LifePromise";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-cream text-navy">
      <Preloader />
      <Header />
      <Hero />
      <KaratasLife />
      <LifePromise />
    </main>
  );
}
