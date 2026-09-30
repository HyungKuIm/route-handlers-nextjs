import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Spring 서버의 이미지를 같은 origin(/images/...)으로 프록시
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: `${process.env.SPRING_API_URL}/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
