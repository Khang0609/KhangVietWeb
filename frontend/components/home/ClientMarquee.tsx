import Link from 'next/link';

export interface Company {
  name: string;
  slug: string;
  logo_url?: string;
}

interface ClientMarqueeProps {
  companies: Company[];
}

export function ClientMarquee({ companies }: ClientMarqueeProps) {
  // Duplicate the array to ensure a seamless loop for the marquee effect
  const marqueeClients = companies.length > 0 ? [...companies, ...companies] : [];

  if (companies.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-[#121212] via-[#1E1E1E] to-[#121212] border-y border-[#FF6B00]/20">
        <p className="text-center text-white/60">Could not load partners.</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#121212] via-[#1E1E1E] to-[#121212] border-y border-[#FF6B00]/20 overflow-hidden">
      <div className="mb-8">
        <p className="text-center text-white/60 tracking-[0.3em] uppercase text-sm">
          Đối tác tin cậy
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1E1E1E] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1E1E1E] to-transparent z-10"></div>

        <div className="flex animate-marquee">
          {marqueeClients.map((client, index) => (
            <div
              key={`${client.slug}-${index}`}
              className="flex-shrink-0 mx-12 text-white/40 hover:text-[#FF6B00] transition-colors duration-300 text-[clamp(1.5rem,3vw,2.5rem)] tracking-widest whitespace-nowrap"
            >
              <Link href={`/projects?company=${client.slug}`}>{client.name.toUpperCase()}</Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
