/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    domains: [
      "plus.unsplash.com",
      "images.getaroom-cdn.com",
      "sleap-io-assets.s3.eu-central-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
