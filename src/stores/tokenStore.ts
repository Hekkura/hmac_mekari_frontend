import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useTokenStore = defineStore('tokenStore', () => {
  //state
  // const secretKey = ref<string | null>(null)
  // const clientId = ref<string | null>(null)

  //actions
  // const fetchTokenData = async () => {
  //   try {
  //     const response = await api.get('/keys')
  //     const data = response.data

  //     secretKey.value = data.clientSecret
  //     clientId.value = data.clientId
  //   } catch (error) {
  //     console.error('Failed to fetch  token data:', error)
  //   }
  // }

  // const secretKey = ref<string>(import.meta.env.VUE_APP_CLIENT_SECRET)
  const secretKey = ref('qvgN6e5yCdQWbtLkj4eIRqi6ohXgPEvR')
  if (!secretKey.value) {
    console.error('CLIENT_SECRET not found in environment variables')
  }

  // const clientId = ref<string>(import.meta.env.VUE_APP_CLIENT_ID)
  const clientId = ref('zNhXoxNB9MfaGfOG')
  if (!clientId.value) {
    console.error('CLIENT_ID not found in environment variables')
  }

  return {
    //state -----
    secretKey,
    clientId,
    //getters -----
    //actions -----
    // fetchTokenData,
  }
})
