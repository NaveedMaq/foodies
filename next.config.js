/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.S3_FOOD_IMAGE_BUCKET}.s3.amazonaws.com`,

        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
