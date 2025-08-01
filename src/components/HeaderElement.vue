<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/./api/index.js'
import { Icon } from '@iconify/vue'
// import { useTokenStore } from '@/stores/tokenStore'

//Reactive data
const profile = ref<any>(null)
const loading = ref(false)
const error = ref('')

//Function to fetch profile
const fetchProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/profile')
    profile.value = response.data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to fetch profile'
    console.error('Profile fetch error!')
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchProfile()
})
</script>
<template>
  <div
    class="p-6 border-1 bg-neutral-900 border-neutral-600 border-dashed flex-2 text-gray-100 flex flex-row gap-5 justify-between align-middle"
  >
    <div class="flex flex-row gap-5">
      <h1 class="font-bold">🔐 Uploadis</h1>
      <div class="flex px-6 gap-7">
        <RouterLink
          :to="{ name: 'config' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 28px" />
          <h1>Profile</h1>
        </RouterLink>
        <RouterLink
          :to="{ name: 'list-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 28px" />
          <h1>Get Document List</h1>
        </RouterLink>
        <RouterLink
          :to="{ name: 'upload-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 28px" />
          <h1>Upload Document</h1>
        </RouterLink>
      </div>
    </div>
    <div class="font-bold font-mono">
      <div class="flex flex-row gap-2">
        <Icon icon="line-md:account" style="font-size: 24px"> </Icon>
        <span v-if="profile">
          {{ profile?.data?.attributes?.full_name }}
        </span>
        <span v-else> Loading.... </span>
      </div>
      <div class="text-xs">
        <span v-if="profile" class="truncate overflow-hidden">
          {{ profile?.data?.attributes?.email }}
        </span>
      </div>
    </div>
  </div>
</template>
