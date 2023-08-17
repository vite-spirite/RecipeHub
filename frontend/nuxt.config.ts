// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [
    {path: '~/components', extensions: ['vue']},
  ],
  site: {
    url: 'http://localhost:3001',
  },
  ssr: true,
  routeRules: {
    '/auth/popup/**': {ssr: false}
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    'nuxt-swiper',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    //'@nuxtjs/robots',
    'nuxt-simple-sitemap',
    'nuxt-simple-robots',
  ],
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
      website: process.env.WEBSITE_URL || 'http://localhost:3001/',
      apiUrl: 'http://localhost:3000',
      cookie: {
        refresh: 'token.refresh',
      },
    }
  },
  robots: {
    disallow: '/auth',
    allow: ['*'],
    sitemap: (process.env.WEBSITE_URL || 'http://localhost:3001/') + 'sitemap.xml'
  },
})