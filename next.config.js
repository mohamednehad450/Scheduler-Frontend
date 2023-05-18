/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,
  publicRuntimeConfig: {
    i18n: {
      languages: ["en", "ar"],
      defaultLanguage: "en",
      namespaces: ["common"],
      defaultNamespace: "common",
    },
  },
};

module.exports = nextConfig;
