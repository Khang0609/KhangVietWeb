"use client";
import Link from "next/link";
import { Company } from "@/components/home/ClientMarquee";

interface GalleryProps {
  companies: Company[];
}

export function GalleryFooter({ companies = [] }: GalleryProps) {
  const gallery = companies.length > 0 ? [...companies, ...companies] : [];

  if (companies.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#121212] via-[#1E1E1E] to-[#121212] border-y border-[#FF6B00]/20">
        <p className="text-center text-white/60">Could not load partners.</p>
      </section>
    );
  }
  return (
    <footer className="bg-[#121212] border-t border-white/10 mt-24">
      {/* Trusted Partners Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-white/40 tracking-wider uppercase mb-8">
            ĐỐI TÁC TIN CẬY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 text-white/30">
            {gallery.map((client, index) => (
              <span key={`${client.slug}-${index}`} className="text-2xl">
                <Link href={`/projects?company=${client.slug}`}>
                  {client.name.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/40">
            <p>© 2024 Khang Việt. All rights reserved.</p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="hover:text-white/60 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-white/60 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
