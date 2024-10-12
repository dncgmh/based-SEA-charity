const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'via.placeholder.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
