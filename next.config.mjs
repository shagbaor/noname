/** @type {import('next').NextConfig} */
const nextConfig = {
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
