<template>
    <div class="recipe w-full sm:p-12 p-4">

        <h1 class="title w-full pb-5 border-b-2 border-orange-200">{{ recipe.name }}</h1>

        <div class="galery flex flex-row justify-between items-center mt-6">
            <Swiper class="w-full" :grab-cursor="true" :effect="'creative'" :modules="[SwiperEffectCreative]" :creativeEffect="{prev: {shadow: true,translate: [0, 0, -400],},next: {translate: ['100%', 0, 0],},}">
                <SwiperSlide v-for="picture in recipe.pictures" :key="picture" class="w-full">
                    <img :src="picture" :alt="recipe.name" class="w-full object-cover rounded-md" />
                </SwiperSlide>
            </Swiper>
        </div>

        <div class="card flex flex-col justify-start items-start sm:flex-row sm:justify-between sm:items-center mt-6">
            <div class="card-title">Time</div>
            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <Icon name="ci:clock" class="h-5 w-5" />
                <span>{{ totalPrepTime }}</span>
            </div>

            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <h6>Preparation:</h6>
                <span>{{ humanizeTime(moment.duration(recipe.preparationTime, 'seconds')) }}</span>
            </div>

            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <h6>Cooking:</h6>
                <span>{{ humanizeTime(moment.duration(recipe.cookingTime, 'seconds')) }}</span>
            </div>

            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <h6>Growing:</h6>
                <span>{{ humanizeTime(moment.duration(recipe.growingTime, 'seconds')) }}</span>
            </div>

            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <h6>Difficulty</h6>
                <div class="flex flex-row justify-center items-center gap-1">
                    <Icon name="fa6-solid:cookie" class="h-5 w-5 text-orange-500" v-for="i in recipe.difficulty"/>
                    <Icon name="fa6-solid:cookie-bite" class="h-5 w-5 text-slate-500" v-for="i in 6 - recipe.difficulty"/>
                </div>
            </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row mt-6 items-start justify-between sm:space-x-3">

            <div class="flex flex-col justify-start items-start flex-1 space-y-3">
                <div class="card w-full" v-for="step in recipe.steps">
                    <div class="card-title">Step {{ step.step }}</div>

                    <div class="card-content">
                        <p>{{ step.description }}</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-5 w-full sm:w-1/3">
                <div class="card p-5 mb-6 sm:mb-0 w-full">
                    <div class="card-title">Ingredients</div>

                    <ul class="list-disc list-inside mt-5">
                        <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">{{ ingredient.ingredient.name }}: {{ ingredient.quantity }} {{ ingredient.overrideUnit ? ingredient.overrideUnit : ingredient.ingredient.unit}}</li>
                    </ul>
                </div>

                <div class="card p-5 mb-6 sm:mb-0 w-full">
                    <div class="card-title">Author</div>

                    <div class="card-content flex flex-row gap-5">
                        <img :src="recipe.author.picture" :alt="recipe.author.firstName" class="w-20 h-20 rounded-full object-cover" />
                        <h5 class="title">{{ recipe.author.firstName }} {{ recipe.author.lastName }}</h5>
                    </div>

                    <div class="card-footer w-full flex flex-row justify-end items-center">
                        <a :href="`/profile/${recipe.author.id}`" class="btn btn-primary ghost">View profile</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RecipeDto } from '~/api/dto/recipe.dto';
import { useApi } from '~/store/useApi';
import moment, { Moment } from 'moment'
const route = useRoute();
const {fetch} = useApi();

const {data: recipe} = await fetch<RecipeDto>(`/recipe/slug/${route.params.recipe}`, 'GET');

const createDescription = computed(() => {
    return recipe.value.steps.map(s => s.description).join(' ').substr(0, 160) + '...';
})

const createTitle = computed(() => {
    return `${recipe.value.name} - RecipeHub`;
})

const totalPrepTime = computed(() => {
    return moment.duration(recipe.value.preparationTime + recipe.value.cookingTime + recipe.value.growingTime, 'seconds').humanize();
})

const humanizeTime = (dur: moment.Duration): string => {
    const date = moment(dur.asMilliseconds()).utc(false);
    return `${date.format('H:mm')}`;
}

const config = useRuntimeConfig();

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
    ogImageUrl: () => recipe.value.pictures[0],
})
</script>