import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import {
  Lightbulb,
  LayoutGrid,
  Box,
  Briefcase,
  Printer,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "../ImageWithFallback";

export function Services() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: LayoutGrid,
      title: "Thi công bảng hiệu",
      description:
        "Thiết kế và thi công bảng hiệu chuyên nghiệp, bắt mắt với đa dạng chất liệu cao cấp.",
      image:
        "https://images.unsplash.com/photo-1760133024870-360068ca0536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduYWdlJTIwZGlzcGxheSUyMGJvYXJkfGVufDF8fHx8MTc2NDI4OTYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Lightbulb,
      title: "Hộp đèn quảng cáo",
      description:
        "Hộp đèn LED hiện đại, tiết kiệm năng lượng, ánh sáng đều và thu hút khách hàng.",
      image:
        "https://images.unsplash.com/photo-1565687901719-d89f700281ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwc2lnbiUyMGxpZ2h0Ym94fGVufDF8fHx8MTc2NDI4OTYzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Box,
      title: "Mô hình trưng bày",
      description:
        "Sản xuất mô hình 3D, standee, kệ trưng bày sản phẩm với thiết kế độc đáo.",
      image:
        "https://images.unsplash.com/photo-1760801802787-86f7958c439e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGFyY2hpdGVjdHVyYWwlMjBtb2RlbHxlbnwxfHx8fDE3NjQyODk2Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Briefcase,
      title: "Bốt sự kiện",
      description:
        "Thiết kế và lắp đặt gian hàng, bốt triển lãm cho các sự kiện quy mô lớn.",
      image:
        "https://images.unsplash.com/photo-1762028892701-692dc360db08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleGhpYml0aW9uJTIwYm9vdGglMjBldmVudHxlbnwxfHx8fDE3NjQyODk2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 bg-gradient-to-b from-[#121212] to-[#0A0A0A] relative overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-4">
            <span className="text-[#FF6B00] tracking-[0.3em] uppercase text-sm border border-[#FF6B00]/30 px-4 py-2">
              Dịch vụ
            </span>
          </div>
          <h2 className="text-[clamp(2.5rem,5vw,4rem)] uppercase tracking-tight">
            <span className="text-white">Giải pháp</span>{" "}
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-transparent">
              toàn diện
            </span>
          </h2>
        </motion.div>

        {/* Services Grid - Broken Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`group relative ${index === 1 ? "md:mt-16" : ""} ${
                index === 3 ? "md:mt-16" : ""
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {/* Glassmorphism Card */}
              <div className="relative overflow-hidden border border-[#FF6B00]/30 bg-[#1E1E1E]/40 backdrop-blur-md hover:bg-[#1E1E1E]/60 transition-all duration-500 h-full">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/50 to-transparent"></div>

                  {/* Icon Overlay */}
                  <div className="absolute top-6 right-6 w-16 h-16 bg-[#FF6B00]/20 backdrop-blur-sm border border-[#FF6B00]/40 flex items-center justify-center group-hover:bg-[#FF6B00]/40 transition-all duration-300">
                    <service.icon className="w-8 h-8 text-[#FF6B00] group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] text-white uppercase tracking-wide mb-4 group-hover:text-[#FF6B00] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* CTA Link */}
                  <a
                    href="#shop"
                    className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-white transition-colors duration-300 group/link"
                  >
                    <span className="tracking-wider uppercase text-sm">
                      Tìm hiểu thêm
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-2 transition-transform duration-300" />
                  </a>
                </div>

                {/* Neon Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D32F2F] to-transparent"></div>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* Additional Service Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 bg-[#1E1E1E]/60 border border-[#FF6B00]/30 px-8 py-4">
            <Printer className="w-6 h-6 text-[#FF6B00]" />
            <span className="text-white/90">
              + In ấn và các dịch vụ hỗ trợ khác
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
