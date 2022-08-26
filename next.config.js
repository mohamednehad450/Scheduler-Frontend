/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: "/api/pins",
        destination: "http://localhost:8000/pins",
      },
      {
        source: "/api/pin",
        destination: "http://localhost:8000/pin",
      },
      {
        source: "/api/pin/:id",
        destination: "http://localhost:8000/pin/:id",
      },
      {
        source: "/api/sequence/events",
        destination: "http://localhost:8000/sequence/events",
      },
      {
        source: "/api/sequence/events/:id",
        destination: "http://localhost:8000/sequence/events/:id",
      },
      {
        source: "/api/sequences",
        destination: "http://localhost:8000/sequences",
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
        source: "/api/crons",
        destination: "http://localhost:8000/crons",
      },
      {
        source: "/api/cron",
        destination: "http://localhost:8000/cron",
      },
      {
        source: "/api/cron/:id",
        destination: "http://localhost:8000/cron/:id",
      },

    ]
  }

}



module.exports = nextConfig
