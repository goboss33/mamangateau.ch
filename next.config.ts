import type { NextConfig } from "next";

/* Les images du Journal sont servies par Carnet (API publique) puis
   optimisées et cachées ICI, derrière Cloudflare — le navigateur ne voit
   jamais le domaine de Carnet. Marque blanche : adapter le hostname. */
const carnetHost = (() => {
  try { return process.env.CARNET_HOOK_URL ? new URL(process.env.CARNET_HOOK_URL).hostname : null; } catch { return null; }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: carnetHost ?? "carnet.mamangateau.ch" }],
  },
};

export default nextConfig;
