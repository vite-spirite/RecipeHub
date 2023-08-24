<template>
    <div class="recipe w-full sm:p-12 p-4">

        <div class="w-full pb-5 border-b-2 border-orange-200 flex flex-row justify-between items-center">
            <h1 class="title w-full">{{ recipe.name }}</h1>

            <div class="favorite-button" v-if="isAuth">
                <Icon name="fa6-solid:heart" class="h-8 w-8 text-red-500 cursor-pointer" v-if="favoriteRecipes.map(f => f.slug).includes(recipe.slug)" @click.prevent="toggleFavoriteRecipe(recipe)"/>
                <Icon name="fa6-solid:heart" class="h-8 w-8 text-red-100 cursor-pointer" v-else @click.prevent="toggleFavoriteRecipe(recipe)"/>
            </div>
        </div>

        <div class="galery flex flex-row justify-between items-center mt-6">
            <Swiper class="w-full" :grab-cursor="true" :effect="'creative'" :modules="[SwiperEffectCreative]" :creativeEffect="{prev: {shadow: true,translate: [0, 0, -400],},next: {translate: ['100%', 0, 0],},}">
                <SwiperSlide v-for="picture in recipe.pictures" :key="picture" class="w-full">
                    <img :src="resolveImagePath(picture)" :alt="recipe.name" class="w-full object-cover rounded-md" />
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

            <div class="flex flex-row space-x-2 sm:space-x-0 sm:flex-col justify-center items-center">
                <h6>Rating</h6>
                <div v-if="recipe.rating > -1" class="flex flex-row justify-center items-center gap-1">
                    <Icon name="fa6-solid:star" class="h-5 w-5 text-orange-500" v-for="i in roundRating(recipe.rating)"/>
                    <Icon name="fa6-solid:star" class="h-5 w-5 text-slate-500" v-for="i in 6 - roundRating(recipe.rating)"/>
                </div>
                <span v-else>No rating</span>
            </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row mt-6 items-start justify-between sm:space-x-3">

            <div class="flex flex-col justify-start items-start flex-1 space-y-3 mt-6 sm:mt-0">
                <div class="card w-full" v-for="step in recipe.steps">
                    <div class="card-title">Step {{ step.step }}</div>

                    <div class="card-content">
                        <p>{{ step.description }}</p>
                    </div>
                </div>
            </div>
            <div class="flex flex-col space-y-3 w-full sm:w-1/3">
                <div class="card p-5 w-full">
                    <div class="card-title">Ingredients</div>

                    <ul class="list-disc list-inside mt-5">
                        <li v-for="ingredient in recipe.ingredients" :key="ingredient.id">{{ ingredient.ingredient.name }}: {{ ingredient.quantity }} {{ ingredient.overrideUnit ? ingredient.overrideUnit : ingredient.ingredient.unit}}</li>
                    </ul>
                </div>

                <div class="card p-5 w-full">
                    <div class="card-title">Author</div>

                    <div class="card-content flex flex-row gap-5 items-center">
                        <img :src="recipe.author.picture" :alt="recipe.author.firstName" class="w-20 h-20 rounded-full object-cover" />
                        <h5 class="title font-md sm:font-xl font-bold">{{ recipe.author.firstName }} {{ recipe.author.lastName }}</h5>
                    </div>

                    <div class="card-footer w-full flex flex-row justify-end items-center">
                        <NuxtLink :to="`/profile/${recipe.author.id}`" class="btn btn-primary ghost">View profile</NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="card w-full mt-6" v-if="isAuth">
            <div class="card-title">Comments</div>

            <div class="card-content">
                <form action="#" class="flex flex-col justify-start items-start space-y-3">
                    <div class="input-control w-full">
                        <label for="rate">Rate</label>
                        <input id="rate" name="rate" type="hidden" class="input" placeholder="Rate" v-bind="rateField"/>

                        <div class="flex flex-row justify-start items-center gap-2">
                            <Icon name="fa6-solid:star" class="h-5 w-5 text-orange-500 cursor-pointer" v-for="i in values.rating" @click.prevent="setFieldValue('rating',i)" :key="`form-rate-${i}`"/>
                            <Icon name="fa6-solid:star" class="h-5 w-5 text-slate-500 cursor-pointer" v-for="i in 6 - roundRating(values.rating)" @click.prevent="setFieldValue('rating',i+roundRating(values.rating))" :key="`form-rate-${i+roundRating(values.rating)}`"/>
                        </div>
                    </div>

                    <div class="input-control w-full">
                        <label for="comment">Comment</label>
                        <textarea id="comment" name="comment" class="input" :error="(typeof errors.comment === 'string')" rows="5" placeholder="Comment" v-bind="commentField"></textarea>
                        <span class="error-text-alt">{{ errors.comment }}</span>
                    </div>
                </form>

                <div class="card-footer w-full flex flex-row justify-end items-center mt-3">
                    <button class="btn btn-primary" :disabled="!meta.valid || isSubmitting" @click="submit">{{ values.edit ? 'Edit' : 'Comment' }}</button>
                </div>
            </div>
        </div>

        <div class="flex flex-col justify-start items-center gap-2 mt-6">
            <div class="card w-full" v-if="recipe.comments" v-for="comment in recipe.comments">
                <div class="card-title flex flex-col sm:flex-row sm:justify-between justify-start items-start sm:items-center">
                    <div class="flex flex-row justify-start items-center space-x-3"><img class="rounded-full h-10" :src="comment.user.picture" :alt="comment.user.firstName"/> <h6 class="text-md">{{ comment.user.firstName }} {{ comment.user.lastName }}</h6></div>
                    
                    <div class="flex flex-row justify-end sm:justify-center items-center gap-1 w-full sm:w-auto">
                        <Icon name="fa6-solid:star" class="h-5 w-5 text-orange-500" v-for="i in roundRating(comment.rating)" :key="`comment-rate-${comment.id}-${i}`"/>
                        <Icon name="fa6-solid:star" class="h-5 w-5 text-slate-500" v-for="i in 6 - roundRating(comment.rating)" :key="`comment-rate-${comment.id}-${roundRating(comment.rating)+i}`"/>
                    </div>
                </div>

                <div class="card-content">
                    <p class="font-secondary font-italic" v-text="comment.comment"></p>
                </div>

                <div class="card-footer">
                    <p class="font-secondary font-italic text-right" v-text="moment(comment.createdAt).utc(false).fromNow()"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RecipeDto } from '~/api/dto/recipe.dto';
import { useApi } from '~/store/useApi';
import { useUser } from '~/store/useUser';
import moment from 'moment'
import { storeToRefs } from 'pinia';
import * as yup from 'yup';

const route = useRoute();
const {fetch} = useApi();

const user = useUser();
const {isAuth, favoriteRecipes, me} = storeToRefs(user);
const {toggleFavoriteRecipe} = user;

if(isAuth && favoriteRecipes.value.length === 0) {
    await user.loadFavoriteRecipes();
}

const {data: recipe} = await fetch<RecipeDto>(`/recipe/slug/${route.params.recipe}`, 'GET');

const createDescription = computed(() => {
    return recipe.value.steps.map(s => s.description).join(' ').substr(0, 160) + '...';
})

const createTitle = computed(() => {
    return `${recipe.value.name} - RecipeHub`;
})

const resolveImagePath = (path: string) => {
        return path.startsWith('http') ? path : `${config.public.apiUrl}/recipe/assets/${path.split('/').pop()}`;
}

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
    ogImage: () => resolveImagePath(recipe.value.pictures[0]),
    ogUrl: () => `${config.public.website}recipe/${recipe.value.slug}`,
    twitterCard: 'summary_large_image',
    twitterTitle: createTitle,
    twitterImage: () => resolveImagePath(recipe.value.pictures[0]),
    description: createDescription,
    ogDescription: createDescription,
    twitterDescription: createDescription,
    ogImageUrl: () => resolveImagePath(recipe.value.pictures[0]),
})

const roundRating = (rating: number): number => {
    return Math.round(rating);
}

const myComment = computed(() => {
    return recipe.value.comments.find(c => c.user.id === me.value?.id);
})

const {values, setFieldValue, defineInputBinds, errors, handleSubmit, meta, isSubmitting, handleReset} = useForm<{comment: string, rating: number, edit: boolean}>({
    initialValues: {
        comment: myComment.value ? myComment.value.comment : '',
        rating: myComment.value ? myComment.value.rating : 0,
        edit: myComment.value ? true : false,
    },
    validationSchema: yup.object({
        comment: yup.string().required().min(10).max(160),
        rating: yup.number().min(0).max(6).required(),
        edit: yup.boolean().default(false).required()
    },),
});

const commentField = defineInputBinds('comment');
const rateField = defineInputBinds('rating');

const submit = handleSubmit(async (data) => {
    const {fetchAsync} = useApi();

    if(!data.edit) {
        const response = await fetchAsync(`/recipe/comment/${recipe.value.id}`, 'POST', true, data);
        if(response) {
            recipe.value.comments.push({...response, user: me.value});
        }
    }
    else {
        const response = await fetchAsync(`/recipe/comment/${myComment.value?.id}`, 'PATCH', true, data);
        if(response) {
            if(recipe.value.comments.find(c => c.id === myComment.value?.id) && myComment) {
                recipe.value.comments[recipe.value.comments.findIndex(c => c.id === myComment.value?.id)] = {...response, user: me.value};
            }
        }
    }

    const comment = myComment.value;

    if(comment) {
        setFieldValue('edit', true);
        setFieldValue('comment', comment.comment);
        setFieldValue('rating', comment.rating);
    }
    else {
        handleReset();
    }

})
</script>