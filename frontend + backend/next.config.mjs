/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Completely exclude HeartbeatWorker from processing
    config.module.rules.push({
      test: /HeartbeatWorker\.js$/,
      use: 'null-loader',
    });

    // Ignore problematic worker files
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /HeartbeatWorker/,
      })
    );

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['@rainbow-me/rainbowkit', '@wagmi/core', 'wagmi'],
}

export default nextConfig
