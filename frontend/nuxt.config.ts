// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  components: [
    {path: '~/components', extensions: ['vue']},
  ],

  ssr: false,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', 'nuxt-swiper', '@pinia/nuxt'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/style.css'
  },
  pinia: {
    autoImports: [
      'defineStore',
      ['defineStore', 'definePiniaStore']
    ]
  },
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:3000',
      cookie: {
        refresh: 'refresh_token',
        access: 'access_token'
      }
    }
  },
})