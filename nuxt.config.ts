const BASE_URL = process.env.APP_MODE === 'production' ? '/openai-api-test/' : '';
console.log('base url', BASE_URL);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: BASE_URL,
    cdnURL: BASE_URL,
  },
  buildDir: 'docs',
  runtimeConfig: {
    public: {
      openApiKey: process.env.OPENAI_API_KEY,
    },
  },
});
