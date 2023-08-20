<template>
  <div>
    <Header />
    <NuxtPage v-if="!loading" />
  </div>
</template>

<script setup lang="ts">
import { useUser } from '~/store/useUser';
const loading = ref(true);

const {refreshToken} = useUser();

if(refreshToken) {
  await useUser().refresh(true);
}

useSeoMeta({
  title: 'RecipeHub',
  description: 'The best recipes in the world',
  ogImage: 'http://localhost:3001/hero-image.jpg',
  ogTitle: 'RecipeHub',
  ogDescription: 'The best recipes in the world',
  ogUrl: 'http://localhost:3001',
  ogSiteName: 'RecipeHub',
  twitterCard: 'summary_large_image',
  twitterSite: '@recipehub',
  twitterCreator: '@recipehub',
  twitterImage: 'http://localhost:3001/hero-image.jpg',
  twitterTitle: 'RecipeHub',
  twitterDescription: 'The best recipes in the world',
})

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
})

loading.value = false;
</script>