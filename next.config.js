/** @type {import('next').NextConfig} */


const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/set-password",
        destination: "/auth/set-password",
        permanent: false,
      },
      {
        source: "/create-password",
        destination: "/auth/set-password",
        permanent: false,
      },
      {
        source: "/settings/profile",
        destination: "/profile/settings",
        permanent: false,
      },
      {
        source: "/settings/documents",
        destination: "/profile/settings/documents",
        permanent: false,
      },
      {
        source: "/settings/vehicle",
        destination: "/profile/settings/vehicle",
        permanent: false,
      },
      {
        source: "/settings",
        destination: "/profile/settings",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.lorem.space",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};


module.exports = nextConfig;