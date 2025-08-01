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
    const response = await api.get('/profile')
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
    class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-2"
  >
    <h1 class="text-2xl font-bold">Profile Configuration</h1>
    <div class="form-start">
      <!-- {{ profile.data }} -->
      <!-- <FormInput type="text" placeholder="Client ID Here...." v-model="profile">
        <template v-slot:label>Client ID :</template>
      </FormInput>
      <FormInput type="text" placeholder="Your Client Secret Key" v-model="profile">
        <template v-slot:label>Client Secret :</template>
      </FormInput> -->
    </div>
  </div>
</template>
