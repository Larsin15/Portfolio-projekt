/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@portfolio/db", "@portfolio/crypto", "@portfolio/pm-core"],
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

module.exports = nextConfig;

