/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')


const nextConfig = {
  i18n,
  reactStrictMode: true,
  rewrites: async () => {
    return [
      {
        source: `/api/pin`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/pin`,
      },
      {
        source: `/api/pin/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/pin/:id`,
      },
      {
        source: `/api/event/sequence`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/event/sequence`,
      },
      {
        source: `/api/event/sequence/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/event/sequence/:id`,
      },
      {
        source: `/api/sequence`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/sequence`,
      },
      {
        source: `/api/sequence/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/sequence/:id`,
      },
      {
        source: `/api/cron`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/cron`,
      },
      {
        source: `/api/cron/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/cron/:id`,
      },
      {
        source: `/api/link/sequence/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/link/sequence/:id`,
      },
      {
        source: `/api/link/cron/:id`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/link/cron/:id`,
      },
      {
        source: `/api/auth/login`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/auth/login`,
      },
      {
        source: `/api/auth/validate`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || "8000"}/auth/validate`,
      },
      {
        source: `/api/auth/register`,
        destination: `http://${process.env.BACKEND_URL || 'localhost'}:${process.env.BACKEND_PORT || `8000`}/auth/register`,
      },
    ]
  }

}

module.exports = nextConfig
