/** @type {import('next').NextConfig} */
const nextConfig = {
  // https://nextjs.org/learn/dashboard-app/partial-prerendering
  // experimental: {
  //     ppr: 'incremental',
  // },
  reactStrictMode: false,
  // typed routes is not usable since we use [locale] which is problematic
  // experimental: {
  //   typedRoutes: true,
  // },
};

export default nextConfig;
