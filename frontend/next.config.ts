import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  // Aggressively flush old compiled pages out of your RAM cache
  onDemandEntries: {
    maxInactiveAge: 10 * 1000, // Keep inactive pages in memory for only 10 seconds
    pagesBufferLength: 1,      // Only hold 1 page cache allocation at a time
  },

  experimental: {
    workerThreads: false,
    cpus: 1,                   // Absolute hard cap restricting compilation to 1 CPU core
    optimizePackageImports: ['lucide-react'] 
  }
};

export default nextConfig;