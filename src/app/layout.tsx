import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-google",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rima Panorama | Karataş Adana'da Satılık Deniz Manzaralı Daireler",
  description:
    "Karataş, Adana'da denizle başlayan büyüleyici bir yaşam. Havuzlu, modern mimariye sahip lüks sahil konut projesi Rima Panorama.",
  keywords: [
    "Rima Panorama",
    "Karataş satılık daire",
    "Adana deniz manzaralı evler",
    "Karataş lüks konut",
    "Adana yazlık projesi",
  ],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-navy overflow-x-hidden selection:bg-flamingo selection:text-white">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
