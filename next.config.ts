import type { NextConfig } from "next";

// rewrites의 destination은 빌드 시점에 확정되므로 빌드 환경에 값이 없을 때의 기본값을 둠
const springApiUrl = process.env.SPRING_API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // node_modules 없이 `node server.js`로 실행 가능한 산출물(.next/standalone) 생성
  // → demo-dog(Spring Boot)에 복사해서 함께 실행
  output: "standalone",

  // Spring 서버의 이미지를 같은 origin(/images/...)으로 프록시
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: `${springApiUrl}/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
