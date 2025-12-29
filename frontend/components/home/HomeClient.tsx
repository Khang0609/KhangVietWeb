"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSplash } from "@/components/providers/SplashProvider";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/home/Hero";
import { ClientMarquee, Company } from "@/components/home/ClientMarquee";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import {
  FeaturedProjects,
  FeaturedProject,
} from "@/components/home/FeaturedProjects";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

interface HomeClientProps {
  companies: Company[];
  featuredProjects: FeaturedProject[];
}

export function HomeClient({ companies, featuredProjects }: HomeClientProps) {
  const { hasShownSplash, setHasShownSplash } = useSplash();
  const router = useRouter();

  useEffect(() => {
    if (hasShownSplash) return;

    const timeout = setTimeout(() => {
      setHasShownSplash(true);
    }, 2000); // Duration of the splash animation

    return () => clearTimeout(timeout);
  }, [hasShownSplash, setHasShownSplash]);

  const navigateToShop = () => {
    router.push("/shop");
  };
  console.log(hasShownSplash);
  if (!hasShownSplash) {
    return (
      <div className="fixed inset-0 bg-[#121212] flex items-center justify-center z-100">
        <div className="relative">
          <div className="text-[80px] tracking-wider animate-pulse bg-linear-to-r from-[#FF6B00] via-[#D32F2F] to-[#FF6B00] bg-clip-text text-transparent">
            KHANG VIỆT
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white overflow-x-hidden">
      <CustomCursor />
      <Navigation onShopClick={navigateToShop} />
      <Hero />
      <ClientMarquee companies={companies} />
      <About />
      <Services />
      <FeaturedProjects projects={featuredProjects} />
      <Footer />
    </div>
  );
}
