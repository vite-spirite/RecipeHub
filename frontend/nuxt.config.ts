// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  components: [
    {path: '~/components', extensions: ['vue']},
  ],
  site: {
    url: process.env.WEBSITE_URL || 'http://localhost:3001',
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
    '@vueuse/nuxt',
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
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      cookie: {
        refresh: 'token.refresh',
      },
      deploymentMode: process.env.DEPLOYMENT_MODE || 'dynamic'
    }
  },
  robots: {
    disallow: '/auth',
    allow: ['*'],
    sitemap: (process.env.WEBSITE_URL || 'http://localhost:3001/') + 'sitemap.xml'
  },
  nitro: {
    prerender: {
      routes: ['/profile/[id]'],
      ignore: ['/profile', '/recipe/create']
    }
  }
})