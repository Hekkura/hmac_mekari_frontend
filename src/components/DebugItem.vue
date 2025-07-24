<script setup lang="ts">
const props = defineProps<{
  data?: string
}>()
</script>
<template>
  <div
    class="border-s-4 border-blue-600 p-2 bg-neutral-800 rounded-sm flex flex-row justify-between"
  >
    <label class="">
      <slot name="label">Sample Text</slot>
    </label>
    {{ props.data }}
  </div>
</template>
