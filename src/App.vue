<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderElement from './components/HeaderElement.vue'
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-gray-100 font-sans">
    <div class="sticky top-0">
      <HeaderElement></HeaderElement>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
  </div>
</template>
