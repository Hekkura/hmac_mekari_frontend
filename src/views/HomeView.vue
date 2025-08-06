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
// const fetchProfile = async () => {
//   loading.value = true
//   error.value = ''

//   try {
//     const response = await api.get('/profile')
//     profile.value = response.data
//   } catch (e: any) {
//     error.value = e.response?.data?.message || 'Failed to fetch profile'
//     console.error('Profile fetch error!')
//   } finally {
//     loading.value = false
//   }
// }

// const tokenStore = useTokenStore()

onMounted(() => {
  // fetchProfile()
})
</script>

<template>
  <div
    class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-2"
  >
    <h1 class="text-2xl font-mono font-bold">Update Profile</h1>
    <h3 class="text-xs font-mono text-gray-500">
      Update your current username by inserting a new Client ID and Key. Your 'session' will be kept
      for 30 minutes.
    </h3>
    <div class="form-start font-mono text-sm">
      {{ profile?.data }}
      <FormInput type="text" placeholder="New Client ID Here...." v-model="profile">
        <template v-slot:label>Client ID :</template>
      </FormInput>
      <FormInput type="text" placeholder="New Client Secret Here...." v-model="profile">
        <template v-slot:label>Client Secret :</template>
      </FormInput>
      <div class="flex justify-end pt-5">
        <button type="submit" class="bg-blue-500 p-2 rounded-lg font-mono text-sm cursor-pointer">
          Update Profile
        </button>
      </div>
    </div>
  </div>
</template>
