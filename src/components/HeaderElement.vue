<script setup lang="ts"></script>
<template>
  <div
    class="p-3 border-1 border-neutral-600 border-dashed flex-2 text-gray-100 flex flex-row gap-5 align-middle"
  >
    <h1 class="text-lg font-bold">🔐 Uploadis</h1>
    <div class="flex px-5 gap-10">
      <RouterLink
        to="/"
        class="text-md font-bold font-mono text-blue-200"
        activeClass="underline text-blue-400"
      >
        <h1>Config</h1>
      </RouterLink>
      <RouterLink
        to="/list_documents"
        class="text-md font-bold font-mono text-blue-200"
        activeClass="underline text-blue-400"
      >
        <h1>Get Document List</h1>
      </RouterLink>
      <RouterLink
        to="/list_documents"
        class="text-md font-bold font-mono text-blue-200"
        activeClass="underline text-blue-400"
      >
        <h1>Upload Document</h1>
      </RouterLink>
    </div>
  </div>
</template>
