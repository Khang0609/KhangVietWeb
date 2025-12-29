import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // CỰC KỲ QUAN TRỌNG: Không cho Google hiện trang Admin lên kết quả tìm kiếm
    },
    sitemap: 'https://quangcaokhangviet.com/sitemap.xml',
  }
}