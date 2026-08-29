/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cfrjdkpnsydyncddffsm.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cart",
        destination: "/varukorg",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/kassa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
