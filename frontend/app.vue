<template>
  <div>
    <Header />
    <NuxtPage />
  </div>
</template>


<script setup lang="ts">

const data = await useFetch('http://localhost:3000/category', 
{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': 'application/json'
  }
})

//console.log(data.data.value)
</script>