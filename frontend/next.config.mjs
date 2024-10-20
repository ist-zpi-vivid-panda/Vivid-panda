/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://nextjs.org/learn/dashboard-app/partial-prerendering
  // experimental: {
  //     ppr: 'incremental',
  // },
  reactStrictMode: false,
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
