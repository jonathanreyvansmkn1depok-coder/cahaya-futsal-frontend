/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',      // Generate static HTML untuk upload ke cPanel
  trailingSlash: true,   // Buat URL jadi /page/ agar .htaccess cPanel mudah menanganinya
  images: {
    unoptimized: true,   // Wajib saat output: 'export' (tidak ada Node.js server)
  },
};

module.exports = nextConfig;
