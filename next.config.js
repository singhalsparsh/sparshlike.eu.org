/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['three'],
  // ── Compression ──
  compress: true,
  // ── Remove Next.js server header ──
  poweredByHeader: false,
  // ── React strict mode for dev ──
  reactStrictMode: true,
  // ── Tree-shake lucide icons ──
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-navigation-menu'],
  },
};

module.exports = nextConfig;
