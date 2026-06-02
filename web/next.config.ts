import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  ...(isGhPages
    ? {
        output: "export",
        basePath: "/fuzz_equipamientos",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  images: isGhPages
    ? { unoptimized: true }
    : {
        remotePatterns: [
          { protocol: "https", hostname: "**.instagram.com" },
          { protocol: "https", hostname: "images.unsplash.com" },
          { protocol: "https", hostname: "**.cdninstagram.com" },
        ],
      },
};

export default nextConfig;
