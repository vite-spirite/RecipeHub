<template>
    
</template>

<script setup lang="ts">
import { useUser } from '~/store/useUser';
import { useRoute } from 'vue-router'
const route = useRoute();

const {setRefreshToken} = useUser();
setRefreshToken(route.params.refresh as string);

window.close();
</script>