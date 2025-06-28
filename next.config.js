/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-project-id.supabase.co'], // Add your supabase project id here
  },
};

module.exports = nextConfig;
