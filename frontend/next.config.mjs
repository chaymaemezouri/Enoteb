/** @type {import('next').NextConfig} */

function uploadPatternFromEnv() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (!raw) {
    return [];
  }

  try {
    const url = new URL(raw);
    return [
      {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: '/uploads/**',
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.enoteb.ma',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
      ...uploadPatternFromEnv(),
    ],
  },
};

export default nextConfig;
