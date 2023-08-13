<template>
    {{ route.params.recipe }}
</template>

<script setup lang="ts">
import { RecipeDto } from '~/api/dto/recipe.dto';
import { useApi } from '~/store/useApi';
const route = useRoute();
const {fetch} = useApi();

const {data: recipe} = await fetch<RecipeDto>(`/recipe/slug/${route.params.recipe}`, 'GET');
console.log(recipe);

const createDescription = computed(() => {
    return recipe.value.steps.map(s => s.description).join(' ').substr(0, 160) + '...';
})

const createTitle = computed(() => {
    return `${recipe.value.name} - RecipeHub`;
})

useSeoMeta({
    title: createTitle,
    ogTitle: createTitle,
    ogImage: () => recipe.value.pictures[0],
    ogUrl: () => `https://recipehub.com/recipe/${recipe.value.slug}`,
    twitterCard: 'summary_large_image',
    twitterTitle: createTitle,
    twitterImage: () => recipe.value.pictures[0],
    description: createDescription,
    ogDescription: createDescription,
    twitterDescription: createDescription,
})
</script>