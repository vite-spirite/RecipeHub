<template>
    <div class="card p-0 rounded-md overflow-hidden">
        <img :src="recipe.pictures[0]" :alt="recipe.name" class="w-full h-48 object-cover rounded-t-md" />

        <div class="card-title pt-5 px-3 flex flex-row justify-between items-between">
            {{ recipe.name }}
        </div>
        <div class="card-content p-4">
            <div class="flex flex-row justify-between items-center">

                <div class="flex flex-row justify-start items-center space-x-2">
                    <Icon name="ci:clock" class="h-5 w-5" />
                    <span>{{ cookingTime }}</span>
                </div>

                <div class="difficulty rounded-md p-1">
                    <span v-for="i in recipe.difficulty" :key="i" class="text-orange-400 text-xl">★</span>
                    <span v-for="i in 6 - recipe.difficulty" :key="i" class="text-gray-400 text-xl">★</span>
                </div>
            </div>
        </div>

        <div class="card-footer p-4 flex flex-row justify-between items-center">
            <div class="author flex flex-row justify-start items-center space-x-1">
                <img :src="recipe.author.picture" :alt="recipe.author.picture" class="w-5 h-5 rounded-full object-cover" />
                <span class="text-sm">{{ recipe.author.firstName }} {{ recipe.author.lastName }}</span>
            </div>

            <NuxtLink :to="`/recipe/${recipe.slug}`" class="ghost">View recipe</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CompactRecipeDto } from 'api/dto/compactRecipe.dto';
import moment from 'moment';

const {recipe} = defineProps<{
    recipe: CompactRecipeDto;
}>();

const cookingTime = computed(() => {
    const duration = moment.duration(recipe.preparationTime + recipe.cookingTime + recipe.growingTime, 'seconds');
    return moment(duration.asMilliseconds()).format('HH:mm');
});
</script>