const nextConfig = {
  productionBrowserSourceMaps: false,

  onDemandEntries: {
    maxInactiveAge: 10 * 1000,
    pagesBufferLength: 1,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;