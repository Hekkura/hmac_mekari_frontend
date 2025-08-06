<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderElement from './components/HeaderElement.vue'
</script>

<template>
  <div class="h-screen bg-neutral-900 text-gray-100 font-sans flex flex-row">
    <div class="">
      <HeaderElement></HeaderElement>
    </div>
    <div class="flex-1 overflow-y-auto">
      <RouterView></RouterView>
    </div>
  </div>
</template>
