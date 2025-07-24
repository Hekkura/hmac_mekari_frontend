<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  placeholder: string
}>()

const model = defineModel<string>()
//TO DO Validate JSON body.
</script>

<template>
  <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
    <label><slot name="label">Sample Label</slot></label>
    <textarea
      v-model="model"
      :placeholder="props.placeholder"
      class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
    ></textarea>
  </div>
</template>
