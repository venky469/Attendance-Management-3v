/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.app',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react', '@/components/ui'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  serverExternalPackages: ['mongodb', 'face-api.js'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        encoding: false,
      }
      
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'async',
          cacheGroups: {
            // Separate chunk for face-api (heavy library)
            faceapi: {
              name: 'faceapi',
              test: /[\\/]node_modules[\\/]face-api\.js/,
              chunks: 'async',
              priority: 30,
            },
            // Separate chunk for recharts (heavy library)
            charts: {
              name: 'charts',
              test: /[\\/]node_modules[\\/]recharts/,
              chunks: 'async',
              priority: 30,
            },
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
