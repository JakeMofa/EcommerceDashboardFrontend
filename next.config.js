/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  transpilePackages: ["antd"],
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  async rewrites() {
    return [
      { source: "/data/forecast", destination: "/data" },
      { source: "/data/daily", destination: "/data" },
      { source: "/data/weekly", destination: "/data" },
      { source: "/data/monthly", destination: "/data" },
      { source: "/privacy", destination: "/privacy.html" },
      {
        source: "/",
        destination: "/landing/index.html",
        missing: [
          {
            type: "cookie",
            key: "TOKEN",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/brands",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "TOKEN",
          },
        ],
        missing: [
          {
            type: "cookie",
            key: "BRAND_ID",
          },
        ],
      },
      {
        source: "/",
        destination: "/brands",
        permanent: false,
        has: [
          {
            type: "cookie",
            key: "TOKEN",
          },
          {
            type: "cookie",
            key: "BRAND_ID",
          },
        ],
      }
    ];
  },
};

module.exports = nextConfig;
