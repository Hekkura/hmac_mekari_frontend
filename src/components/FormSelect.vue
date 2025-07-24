<script setup lang="ts">
const props = defineProps<{
  options: string[]
}>()

const model = defineModel()
</script>

<template>
  <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
    <label><slot name="label">Sample Label</slot></label>
    <select
      v-model="model"
      class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
    >
      <option v-for="option in options" :value="option">{{ option }}</option>
    </select>
  </div>
</template>
