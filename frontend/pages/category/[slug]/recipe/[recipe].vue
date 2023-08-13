<template>
    {{ route.params.slug }} {{ route.params.recipe }}
</template>

<script setup lang="ts">
const route = useRoute();
</script>