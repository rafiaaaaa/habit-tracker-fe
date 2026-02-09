import { Navbar } from "@/features/home/components/Navbar";
import type { Route } from "./+types/home";
import { Hero } from "@/features/home/components/Hero";
import { Features } from "@/features/home/components/Features";
import { Pricing } from "@/features/home/components/Pricing";
import { Footer } from "@/features/home/components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
