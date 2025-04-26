/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Opciones adicionales si necesitas
      allowedOrigins: ["localhost:3000"],
    },
  },
}

export default nextConfig