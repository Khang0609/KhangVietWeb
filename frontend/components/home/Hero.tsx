import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1614608792503-d76e3bfd024a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwc2lnbiUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NjQyODk1NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Neon sign construction"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#121212]/90 via-[#121212]/70 to-[#121212]"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#FF6B00]/10 to-[#D32F2F]/10"></div>
      </div>

      {/* Content - Broken Grid Layout */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Headline - Broken Grid Position */}
          <motion.div
            className="lg:col-span-8 lg:col-start-1"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                <h1 className="text-[clamp(2.5rem,8vw,5rem)] uppercase leading-[1.2]">
                  <span className="block text-white">KHANG VIỆT</span>
                </h1>
              </motion.div>

              <motion.div
                className="overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <h2 className="text-[clamp(1.8rem,5vw,3.5rem)] uppercase leading-[1.1]">
                  <span className="block bg-linear-to-r from-[#FF6B00] via-[#FF8C00] to-[#D32F2F] bg-clip-text text-transparent">
                    Sản phẩm chất lượng
                  </span>
                  <span className="block text-white/90 mt-2">tuyệt đối</span>
                </h2>
              </motion.div>
            </div>
          </motion.div>

          {/* Sub-headline - Offset Position */}
          <motion.div
            className="lg:col-span-5 lg:col-start-8 lg:row-start-1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          >
            <div className="bg-[#1E1E1E]/60 backdrop-blur-sm p-8 border border-[#FF6B00]/30 relative">
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#FF6B00]/20 blur-xl"></div>
              <p className="text-white/90 text-[clamp(1rem,2vw,1.25rem)] leading-relaxed tracking-wide">
                Chuyên thiết kế trang trí nội thất & Quảng cáo
              </p>
              <div className="mt-6 h-[2px] w-20 bg-linear-to-r from-[#FF6B00] to-[#D32F2F]"></div>
            </div>
          </motion.div>

          {/* CTA Button - Broken Grid Position */}
          <motion.div
            className="lg:col-span-4 lg:col-start-2 lg:row-start-2 mt-8 lg:mt-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          >
            <a
              href="#services"
              className="inline-block bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-12 py-5 text-[clamp(1rem,2vw,1.25rem)] tracking-widest uppercase relative overflow-hidden group transition-all duration-300"
            >
              <span className="relative z-10">Khám Phá Ngay</span>
              <span className="absolute inset-0 bg-linear-to-r from-[#D32F2F] to-[#FF6B00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.5,
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <ChevronDown className="text-[#FF6B00] w-8 h-8" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-2 h-40 bg-linear-to-b from-[#FF6B00] to-transparent opacity-30"></div>
      <div className="absolute bottom-1/4 left-10 w-40 h-2 bg-linear-to-r from-[#D32F2F] to-transparent opacity-30"></div>
    </section>
  );
}
