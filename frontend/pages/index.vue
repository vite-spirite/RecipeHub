<template>
    <div>
        <Hero class="min-h-[300px] flex flex-row justify-around items-center py-5">
            <div class="flex flex-col justify-center md:items-start items-center">
                <h1 class="text-5xl font-secondary font-[600] text-slate-900">RecipeHub</h1>
                <p class="text-2xl text-slate-700">The best recipes in the world</p>
            </div>

            <img src="hero-image.jpg" alt="hero image" class="w-1/4 rotate-45 rounded-full hidden md:block" />
        </Hero>

        <Swiper :slides-per-view="'auto'" :space-between="15-2" class="mt-5 mx-2" :centered-slides="true" :mousewheel="true">
            <SwiperSlide v-for="(item, i) in category.data.value" :key="item.id" class="!w-auto">
                <a href="#" :class="{'text-2xl font-secondary font-[600] w-auto px-3 py-3 rounded-md block transition-all duration-500': true, 'text-slate-900 bg-slate-100': selectedCategory != i, 'bg-orange-400 text-slate-100': selectedCategory == i}" @click.prevent="selectedCategory = i">{{ item.name }}</a>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup lang="ts">
const category = await useFetch<{name: string, id: number}[]>('http://localhost:3000/category', 
{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json'
  }
});

const selectedCategory = ref(0);
</script>