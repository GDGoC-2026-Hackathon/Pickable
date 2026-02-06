/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloud Run 배포를 위한 standalone 모드
  output: 'standalone',
  
  // 프로덕션 최적화
  reactStrictMode: true,
  
  // swagger-ui-react ESM 호환을 위한 트랜스파일 설정
  transpilePackages: ['swagger-ui-react'],
  
  // 이미지 최적화 설정 (필요시)
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
