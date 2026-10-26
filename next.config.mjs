/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Voice notes on comments are capped at 3 MB; leave headroom for the form fields
    serverActions: { bodySizeLimit: "4mb" },
  },
  async redirects() {
    return [
      // Sections moved under Stories and Archive
      { source: "/essays", destination: "/stories/essays", permanent: true },
      { source: "/testimonies", destination: "/stories/testimonies", permanent: true },
      { source: "/timeline", destination: "/archive/timeline", permanent: true },
    ]
  },
}

export default nextConfig
