/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Run 배포를 위한 standalone 모드
  output: 'standalone',
  
  // 프로덕션 최적화
  reactStrictMode: true,
  
  // 이미지 최적화 설정 (필요시)
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
