<template>
    <div class="w-full flex flex-row justify-between items-center sm:px-6 px-4 py-2 bg-orange-300 rounded-b-xl space-x-5">
        <div class="title">
            <NuxtLink to="/">
                <img src="/logo.png" alt="logo" class="h-10" />
            </NuxtLink>
        </div>

        <div class="search flex-1 md:flex-none md:w-1/4 px-2 py-2 bg-orange-200 rounded-full flex flex-row">
            <input type="text" placeholder="Search for recipes" class="bg-transparent border-0 text-slate-500 flex-1 sm:mx-5 outline-none" />
            <button class="bg-orange-300 rounded-full md:min-h-[24px] p-1 flex justify-center items-center"><Icon name="ci:search" class="h-full w-full"/></button>
        </div>

        <div v-if="!isAuth" class="hidden sm:flex user flex-row justify-between space-x-2 text-xl">
            <NuxtLink to="/auth/login">Login</NuxtLink>
            <NuxtLink to="/auth/register">Signup</NuxtLink>
        </div>
        <div v-else class="hidden sm:flex user flex-row justify-between space-x-2 text-xl">
            <button class="bg-none font-primary text-slate-500 flex flex-row space-x-3 items-center justify-center" @click="logout"><img :src="me?.picture" class="h-10 rounded-full"/> <span class="font-primary text-bold hidden md:inline">{{ me?.firstName }} {{ me?.lastName }}</span></button>
        </div>

    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUser } from '~/store/useUser';

const user = useUser();
const {isAuth, me} = storeToRefs(user);
const {logout} = user;
</script>