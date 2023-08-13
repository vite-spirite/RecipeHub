<template>
    <div>
        <Hero class="min-h-[300px] flex flex-row justify-around items-center py-5">
            <div class="flex flex-col justify-center md:items-start items-center">
                <h1 class="text-5xl font-secondary font-[600] text-slate-900">RecipeHub</h1>
                <p class="text-2xl text-slate-700">The best recipes in the world</p>
            </div>

            <img src="hero-image.jpg" alt="hero image" class="w-1/4 rotate-45 rounded-full hidden md:block" />
        </Hero>

        <Swiper v-if="categories && categories.length > 0" :slides-per-view="'auto'" :space-between="15-2" class="mt-5 mx-2" :centered-slides="true" :mousewheel="true">
            <SwiperSlide v-for="(item, i) in categories" :key="item.id" class="!w-auto">
                <a href="#" :class="{'text-2xl font-secondary font-[600] w-auto px-3 py-3 rounded-md block transition-all duration-500': true, 'text-slate-900 bg-slate-100': selectedCategory != i, 'bg-orange-400 text-slate-100': selectedCategory == i}" @click.prevent="selectedCategory = i">{{ item.name }}</a>
            </SwiperSlide>
        </Swiper>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 px-5">
            <Recipe v-for="recipe in categories[selectedCategory].recipes.data" :key="recipe.slug" :recipe="recipe" :category="categories[selectedCategory]" />
        </div>

        <div class="p-5">
            <button v-if="categories[selectedCategory].recipes.page < categories[selectedCategory].recipes.lastPage" @click="categoriesStore.fetchRecipes(categories[selectedCategory], categories[selectedCategory].recipes.page+1);" class="py-3 block w-full bg-orange-500 text-slate-100 font-primary font-medium text-lg rounded-lg">Load more</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCategory } from '~/store/category';

const selectedCategory = ref(0);

const categoriesStore = useCategory();

const {categories} = storeToRefs(categoriesStore);

await categoriesStore.fetchCategories();

if(categories.value[selectedCategory.value].recipes.data.length == 0) {
    await categoriesStore.fetchRecipes(categories.value[selectedCategory.value], 1);
}

watch(selectedCategory, async (value) => {
    if(categories.value[value].recipes.data.length > 0) return;

    await categoriesStore.fetchRecipes(categories.value[value], 1);
});
</script>