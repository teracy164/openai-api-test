// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL,
    cdnURL: process.env.BASE_URL,
  },
  runtimeConfig: {
    public: {
      openApiKey: process.env.OPENAI_API_KEY,
    },
  },
});
