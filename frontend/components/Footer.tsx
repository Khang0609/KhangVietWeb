import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  const quickLinks = [
    { label: "Trang chủ", href: "#home" },
    { label: "Dự án", href: "#projects" },
    { label: "Dịch vụ", href: "#services" },
    { label: "Cửa hàng", href: "#shop" },
    { label: "Liên hệ", href: "#contact" },
  ];

  const services = [
    "Thi công bảng hiệu",
    "Hộp đèn quảng cáo",
    "Mô hình trưng bày",
    "Bốt sự kiện",
    "In ấn quảng cáo",
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#FF6B00]/20 bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/3 blur-[200px]"></div>
      <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-[#D32F2F]/3 blur-[200px]"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Company Info - Larger Section */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="mb-6 text-[clamp(2rem,4vw,3rem)] tracking-tight uppercase">
                  <span className="bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-transparent">
                    KHANG VIỆT
                  </span>
                </h3>
                <p className="mb-8 max-w-md leading-relaxed text-white/70">
                  Chuyên thiết kế trang trí nội thất & Quảng cáo. Tiêu chí làm
                  việc là ưu tiên chất lượng sản phẩm lên cao nhất.
                </p>

                {/* Contact Info */}
                <div className="space-y-4">
                  <a
                    href="https://maps.app.goo.gl/17adth7QdX5nhSKNA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-white/70 transition-colors duration-300 hover:text-[#FF6B00]"
                  >
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-[#FF6B00] transition-transform duration-300 group-hover:scale-110" />
                    <span>
                      687/24/34 Kinh Dương Vương, phường An Lạc, TP.HCM
                    </span>
                  </a>

                  <a
                    href="tel:+84903 680 449"
                    className="group flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-[#FF6B00]"
                  >
                    <Phone className="h-5 w-5 text-[#FF6B00] transition-transform duration-300 group-hover:scale-110" />
                    <span>0903 680 449</span>
                  </a>

                  <a
                    href="mailto:khangvietdesign@gmail.com"
                    className="group flex items-center gap-3 text-white/70 transition-colors duration-300 hover:text-[#FF6B00]"
                  >
                    <Mail className="h-5 w-5 text-[#FF6B00] transition-transform duration-300 group-hover:scale-110" />
                    <span>khangvietdesign@gmail.com</span>
                  </a>

                  <div className="flex items-center gap-3 text-white/70">
                    <Clock className="h-5 w-5 text-[#FF6B00]" />
                    <span>T2 - T7: 8:00 - 19:00</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-6 text-[clamp(1rem,2vw,1.25rem)] tracking-wider text-white uppercase">
                Liên kết
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-white/70 transition-colors duration-300 hover:text-[#FF6B00]"
                    >
                      <span className="h-[2px] w-0 bg-[#FF6B00] transition-all duration-300 group-hover:w-4"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-6 text-[clamp(1rem,2vw,1.25rem)] tracking-wider text-white uppercase">
                Dịch vụ
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-white/70"
                  >
                    <span className="mt-1 text-[#FF6B00]">▸</span>
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 border-t border-[#FF6B00]/20 pt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div>
                <h4 className="mb-2 text-[clamp(1.5rem,3vw,2rem)] text-white">
                  Bạn cần tư vấn cho dự án?
                </h4>
                <p className="text-white/60">
                  Liên hệ ngay với chúng tôi để được hỗ trợ tốt nhất
                </p>
              </div>
              <Button className="group relative overflow-hidden bg-[#FF6B00] px-8 py-6 text-lg whitespace-nowrap text-white hover:bg-[#FF6B00]/80">
                <span className="relative z-10">Liên Hệ Ngay</span>
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-[#D32F2F] to-[#FF6B00] transition-transform duration-500 group-hover:translate-x-0"></span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FF6B00]/20 py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Copyright */}
            <motion.div
              className="text-sm text-white/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              © 2025 Khang Việt. All rights reserved.
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center border border-[#FF6B00]/30 transition-all duration-300 hover:border-[#FF6B00] hover:bg-[#FF6B00]/20"
                >
                  <social.icon className="h-5 w-5 text-white/70 transition-colors duration-300 group-hover:text-[#FF6B00]" />
                </a>
              ))}
            </motion.div>

            {/* Terms */}
            <motion.div
              className="flex items-center gap-6 text-sm text-white/50"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <a
                href="#"
                className="transition-colors duration-300 hover:text-[#FF6B00]"
              >
                Chính sách bảo mật
              </a>
              <span>|</span>
              <a
                href="#"
                className="transition-colors duration-300 hover:text-[#FF6B00]"
              >
                Điều khoản dịch vụ
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
