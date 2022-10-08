/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/api/pin",
        destination: "http://localhost:8000/pin",
      },
      {
        source: "/api/pin/:id",
        destination: "http://localhost:8000/pin/:id",
      },
      {
        source: "/api/events/sequences",
        destination: "http://localhost:8000/events/sequences",
      },
      {
        source: "/api/events/sequences/:id",
        destination: "http://localhost:8000/events/sequences/:id",
      },
      {
        source: "/api/sequence",
        destination: "http://localhost:8000/sequence",
      },
      {
        source: "/api/sequence/:id",
        destination: "http://localhost:8000/sequence/:id",
      },
      {
        source: "/api/cron",
        destination: "http://localhost:8000/cron",
      },
      {
        source: "/api/cron/:id",
        destination: "http://localhost:8000/cron/:id",
      },
      {
        source: "/api/link/sequence/:id",
        destination: "http://localhost:8000/link/sequence/:id",
      },
      {
        source: "/api/link/cron/:id",
        destination: "http://localhost:8000/link/cron/:id",
      },
    ]
  }

}



module.exports = nextConfig
