import path from 'path';

const BASE_URL = process.env.APP_MODE === 'production' ? '/openai-api-test/' : '';
console.log('base url', BASE_URL);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: BASE_URL,
    cdnURL: BASE_URL,
  },
  runtimeConfig: {
    public: {
      openApiKey: process.env.OPENAI_API_KEY,
    },
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, '/docs'),
    },
  },
});
