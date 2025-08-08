<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormInput from '@/components/FormInput.vue'
import api from '@/./api/index.js'
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
    const response = await api.get('/MekariProfile')
    profile.value = response.data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to fetch profile'
    console.error('Profile fetch error!')
  } finally {
    loading.value = false
  }
}

// const tokenStore = useTokenStore()

onMounted(() => {
  // fetchProfile()
})
</script>

<template>
  <div
    id="container"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono"
  >
    <!--     class="p-6 w-full bg-neutral-900 border-1
     border-neutral-600 border-dashed rounded-lg flex-2" -->
    <!-- Header -->
    <div class="pb-2">
      <h1 class="text-xl font-mono font-bold">Update Profile</h1>
      <h3 class="text-sm font-mono text-gray-500">
        Update your current username by inserting a new Client ID and Key. Your 'session' will be
        kept for 30 minutes.
      </h3>
    </div>

    <div
      class="border-1 border-neutral-600 border-dashed rounded-lg shadow p-5 w-full form-start font-mono text-sm"
    >
      {{ profile?.data }}
      <FormInput type="text" placeholder="New Client ID Here...." v-model="profile">
        <template v-slot:label>Client ID :</template>
      </FormInput>
      <FormInput type="text" placeholder="New Client Secret Here...." v-model="profile">
        <template v-slot:label>Client Secret :</template>
      </FormInput>
      <div class="flex justify-end pt-5">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-300 disabled:bg-gray-700 py-2 px-6 rounded-lg font-mono text-md cursor-pointer"
        >
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>

          <span v-else>Update Profile</span>
        </button>
      </div>
    </div>
  </div>
</template>
