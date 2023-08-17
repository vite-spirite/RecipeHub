<template>
    <div class="profile py-5 flex flex-col">
        <h2 class="title w-full px-5 pt-16 pb-5">Informations</h2>

        <div class="divider_h"></div>

        <div class="user-information flex flex-col justify-center items-center sm:flex-row sm:items-center space-y-16 sm:space-y-0 sm:space-x-24 py-5 px-5">
            <img class="sm:h-60 h-20 rounded-full" :src="profile?.picture" alt="profile image" />

            <ul class="flex flex-col justify-start items-start space-y-2">
                <li><h1 class="title">{{ profile?.firstName }} {{ profile?.lastName }} profile</h1></li>
                <li>
                    <span class="text-bold">Frist name:</span> {{ profile?.firstName }}
                </li>
                <li>
                    <span class="text-bold">Last name:</span> {{ profile?.lastName }}
                </li>
                <li>
                    <span class="text-bold">Account created at:</span> {{ moment(profile?.createdAt).format('DD/MM/YYYY') }}
                </li>
            </ul>
        </div>

        <h2 class="title w-full pt-16 pb-5 px-5">Recipes</h2>
        <div class="divider_h"></div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5 px-5" v-if="profile?.recipes.length > 0">
            <Recipe class:="w-full" v-if="profile" v-for="recipe in profile?.recipes" :key="recipe.slug" :recipe="{...recipe, author: {id: profile.id, firstName: profile.firstName, lastName: profile.lastName, picture: profile.picture}}" />
        </div>
        <div v-else class="flex flex-col justify-center items-center space-y-5 mt-5 px-5">
            <h1 class="title">{{ profile?.firstName }} {{ profile?.lastName }} don't have any recipes yet</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useProfile } from '~/store/useProfile';
    import { useUser } from '~/store/useUser';
    import moment from 'moment';

    const {me} = useUser();
    const route = useRoute();

    const id = +(route.params.id as string);

    if(!id ||me && id == me.id) {
        navigateTo('/profile');
    }

    const {fetchProfile, fetchProfileRecipe} = useProfile();
    const profile = await fetchProfile(id);
    
    if(!profile.id) {
        navigateTo('/profile');
    }

    if(!profile.recipes.length) {
        profile.recipes = await fetchProfileRecipe(id)
    }
</script>