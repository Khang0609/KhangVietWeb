import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Target, Award, Users } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    { icon: Target, label: "Dự án hoàn thành", value: "500+" },
    { icon: Award, label: "Năm kinh nghiệm", value: "15+" },
    { icon: Users, label: "Đối tác tin cậy", value: "200+" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#121212] py-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[#FF6B00]/5 blur-[150px]"></div>
      <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#D32F2F]/5 blur-[150px]"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Asymmetrical Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column - Text Content (Offset) */}
          <motion.div
            className="space-y-8 lg:col-span-6 lg:col-start-1 lg:row-start-1"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div>
              <div className="mb-4 inline-block">
                <span className="border border-[#FF6B00]/30 px-4 py-2 text-sm tracking-[0.3em] text-[#FF6B00] uppercase">
                  Về Chúng Tôi
                </span>
              </div>
              <h2 className="text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight uppercase">
                <span className="text-white">Tiêu chí làm việc là</span>
                <br />
                <span className="bg-gradient-to-r from-[#FF6B00] to-[#D32F2F] bg-clip-text text-transparent">
                  ưu tiên chất lượng
                </span>
                <br />
                <span className="text-white">sản phẩm lên cao nhất</span>
              </h2>
            </div>

            <div className="max-w-xl space-y-6 leading-relaxed text-white/70">
              <p>
                Khang Việt là đơn vị hàng đầu trong lĩnh vực thiết kế, thi công
                quảng cáo và trang trí nội thất. Với hơn 15 năm kinh nghiệm,
                chúng tôi tự hào mang đến những giải pháp sáng tạo và chất lượng
                cao cho các đối tác lớn.
              </p>
              <p>
                Chúng tôi không ngừng đổi mới, áp dụng công nghệ hiện đại và đội
                ngũ thợ lành nghề để đảm bảo mỗi sản phẩm đều đạt tiêu chuẩn
                hoàn hảo nhất.
              </p>
              <p>
                Chúng tôi không ngừng đổi mới, áp dụng công nghệ hiện đại và đội
                ngũ thợ lành nghề để đảm bảo mỗi sản phẩm đều đạt tiêu chuẩn
                hoàn hảo nhất.
              </p>
            </div>

            {/* Stats Grid - Broken Layout */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="group cursor-default">
                  <div className="mb-3">
                    <stat.icon className="h-8 w-8 text-[#FF6B00] transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="text-[clamp(1.5rem,3vw,2rem)] text-white transition-colors duration-300 group-hover:text-[#FF6B00]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm tracking-wider text-white/60 uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Image (Offset Position) */}
          <motion.div
            className="relative h-full lg:col-span-5 lg:col-start-8 lg:row-start-1"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="group relative h-full">
              {/* Main Image */}
              <div className="relative h-full overflow-hidden border-2 border-[#FF6B00]/30 transition-all duration-500 group-hover:border-[#FF6B00]/60">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1764114440403-4dd539cb582a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd29ya3Nob3AlMjBtYW51ZmFjdHVyaW5nfGVufDF8fHx8MTc2NDI4OTYwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Industrial workshop"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Decorative Frame Elements */}
              <div className="absolute -top-4 -left-4 h-24 w-24 border-t-2 border-l-2 border-[#FF6B00]"></div>
              <div className="absolute -right-4 -bottom-4 h-24 w-24 border-r-2 border-b-2 border-[#D32F2F]"></div>
            </div>
          </motion.div>

          {/* Bottom Text - Offset Position */}
          <motion.div
            className="mt-8 lg:col-span-4 lg:col-start-2 lg:row-start-2"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="border-l-4 border-[#FF6B00] bg-[#1E1E1E]/60 p-6">
              <p className="mb-2 text-sm tracking-wider text-[#FF6B00] uppercase">
                Cam kết chất lượng
              </p>
              <p className="text-white/80">
                Mỗi sản phẩm của chúng tôi đều trải qua quy trình kiểm định
                nghiêm ngặt để đảm bảo độ bền và tính thẩm mỹ cao nhất.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
