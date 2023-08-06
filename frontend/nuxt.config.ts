// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  components: [
    {path: '~/components', extensions: ['vue']},
  ],

  ssr: false,
  modules: ['@nuxtjs/tailwindcss', 'nuxt-icon', 'nuxt-swiper'],
  tailwindcss: {
    configPath: '~/tailwind.config.ts',
    cssPath: '~/style.css'
  }
})