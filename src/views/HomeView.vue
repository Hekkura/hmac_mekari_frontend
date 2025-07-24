<script setup lang="ts">
import { onMounted } from 'vue'
import { useTokenStore } from '@/stores/tokenStore'
import FormInput from '@/components/FormInput.vue'

const tokenStore = useTokenStore()

// onMounted(async () => {
//   tokenStore.fetchTokenData()
// })
</script>

<template>
  <div
    class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-2"
  >
    <h1 class="text-3xl font-bold">🔐 Configuration</h1>
    <div class="form-start">
      <FormInput type="text" placeholder="Client ID Here...." v-model="tokenStore.clientId">
        <template v-slot:label>Client ID :</template>
      </FormInput>
      <FormInput type="text" placeholder="Your Client Secret Key" v-model="tokenStore.secretKey">
        <template v-slot:label>Client Secret :</template>
      </FormInput>
    </div>
  </div>
</template>
