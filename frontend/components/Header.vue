<template>
    <div class="w-full flex flex-row justify-between items-center sm::px-6 px-4 py-2 bg-orange-300 rounded-b-xl">
        <div class="title">
            <a href="/">RecipeHub</a>
        </div>

        <div class="search sm:w-1/4 px-2 py-2 bg-orange-200 rounded-full flex flex-row">
            <input type="text" placeholder="Search for recipes" class="bg-transparent border-0 text-slate-500 flex-1 sm:mx-5 outline-none" />
            <button class="bg-orange-300 rounded-full md:min-h-[24px] p-1 flex justify-center items-center"><Icon name="ci:search" class="h-full w-full"/></button>
        </div>

        <div class="hidden sm:flex user flex-row justify-between space-x-2 text-xl">
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </div>
    </div>
</template>

<style>

</style>