import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export", // next exportを有効化(Next.jsをHTML/CSS/JSに変換)
  images: {
    unoptimized: true,  // Next/ImageはデフォルトでNode.jsを使うため、静的配信ではOFF
  }
};

export default nextConfig;
