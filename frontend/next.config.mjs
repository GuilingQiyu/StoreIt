/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // In development, Next.js can proxy API requests to Spring Boot
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:59898/api/:path*',
          },
          {
            source: '/storage/:path*',
            destination: 'http://localhost:59898/storage/:path*',
          },
          {
            source: '/d/:path*',
            destination: 'http://localhost:59898/d/:path*',
          },
          {
            source: '/preview/:path*',
            destination: 'http://localhost:59898/preview/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
