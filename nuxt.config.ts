// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/openai-api-test/',
  },
  runtimeConfig: {
    public: {
      openApiKey: process.env.OPENAI_API_KEY,
    },
  },
});
