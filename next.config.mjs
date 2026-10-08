/** @type {import('next').NextConfig} */
const nextConfig = {
  // The sandboxed preview is served from a proxied host, so allow it explicitly.
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "localhost", "127.0.0.1"],
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { optimizePackageImports: ["lucide-react"] },
};

export default nextConfig;
