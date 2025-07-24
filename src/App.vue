<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, watch, onMounted } from 'vue'

import { methodsExport } from './types/Methods'
import type { debugInfoType } from './types/hmacAPITypes'

import FormInput from './components/FormInput.vue'
import FormInputArea from './components/FormInputArea.vue'
import FormSelect from './components/FormSelect.vue'
import DebugItem from './components/DebugItem.vue'
import HeaderElement from './components/HeaderElement.vue'

// const apiConfig = ref({
//   apiUrl: '',
//   apiMethod: '',
//   clientId: '',
//   clientSecret: '',
//   requestBody: '',
//   additionalHeaders: '{"Content-Type": "application/json"}',
// })

// //save credentials ClientID and ClientSecret to LocalStorage (don't do this!)
// onMounted(() => {
//   apiConfig.value.clientId = localStorage.getItem('hmac_client_id') || ''
//   apiConfig.value.clientSecret = localStorage.getItem('hmac_client_secret') || ''
// })

// //save new credentials when they change.
// watch(
//   () => apiConfig.value.clientId,
//   (clientIdVal) => {
//     localStorage.setItem('hmac_client_id', clientIdVal)
//   },
// )

// watch(
//   () => apiConfig.value.clientSecret,
//   (clientSecretval) => {
//     localStorage.setItem('hmac_client_secret', clientSecretval)
//   },
// )

// //"Create a reactive object (wrapped in a ref) that accepts dynamic keys (strings) with any type of values, starting as an empty object."
// const debugInfo = ref<debugInfoType>({})
// // CONTAIN API RESPONSE
// const response = ref<Record<string, any>>({})

// //generate Body Digest
// async function generate_body_digest(body: string) {
//   const encoder = new TextEncoder()
//   const digestData = encoder.encode(body)

//   const hashBuffer = await crypto.subtle.digest('SHA-256', digestData)
//   const hashArray = Array.from(new Uint8Array(hashBuffer))
//   const base64Digest = btoa(String.fromCharCode(...hashArray))

//   return base64Digest
// }

// //generate HMAC Signature
// async function generate_hmac_sig(stringToSign: string, clientSecret: string) {
//   const encoder = new TextEncoder()
//   //calculate HMAC Signature
//   const keyData = encoder.encode(clientSecret)
//   const sigData = encoder.encode(stringToSign)

//   //1. import secret key
//   const cryptoKey = await crypto.subtle.importKey(
//     'raw', // raw key material
//     keyData, // ArrayBuffer
//     { name: 'HMAC', hash: 'SHA-256' }, // algorithm
//     false, // not extractable
//     ['sign'], // usage
//   )

//   //2. Generate HMAC Signature
//   const signature = await crypto.subtle.sign('HMAC', cryptoKey, sigData)
//   const bytes = new Uint8Array(signature)
//   return btoa(String.fromCharCode(...bytes))
// }

// //generate header signature
// async function generateSignature() {
//   try {
//     console.log(apiConfig.value.apiMethod)
//     //create request line
//     const requestLine = `${apiConfig.value.apiMethod} ${apiConfig.value.apiUrl} HTTP/1.1`

//     //generate date format
//     const now = new Date()
//     const formattedDate = now.toUTCString()

//     //convert String To Sign
//     const stringToSign = `date: ${formattedDate}\nrequest-line:${requestLine}`

//     //generate body digest and HMAC signature
//     const body = apiConfig.value.requestBody || ''

//     const digest_sha256 = await generate_body_digest(body)
//     const hmac_sha256 = await generate_hmac_sig(stringToSign, apiConfig.value.clientSecret)

//     //create authorization Header
//     const authHeader = `hmac username="${apiConfig.value.clientId}", algorithm="hmac-sha256", headers="date request-line", signature="${hmac_sha256}"`

//     //store debug info
//     debugInfo.value = {
//       dateFormat: formattedDate,
//       requestLine: requestLine,
//       stringToSign: stringToSign,
//       stringToSignJson: JSON.stringify(stringToSign),
//       signature: hmac_sha256,
//       bodyDigest: digest_sha256,
//       authHeader: authHeader,
//     }

//     console.log(debugInfo.value)
//   } catch (error: any) {
//     alert('Error generating signature : ' + error.message)
//   }
// }

// //Send Request
// async function sendRequest() {
//   console.log('sendRequest')
//   if (!debugInfo.value) {
//     await generateSignature()
//   }

//   let headers: Record<string, string> = {}

//   try {
//     headers = JSON.parse(apiConfig.value.additionalHeaders || '{}')
//   } catch (e) {
//     alert('invalid JSON in additional Headers')
//     return
//   }

//   headers = {
//     ...headers,
//     Date: debugInfo.value.dateFormat || '',
//     Authorization: debugInfo.value.authHeader || '',
//   }
//   console.log(headers)
//   if (
//     apiConfig.value.requestBody &&
//     ['POST', 'PUT', 'PATCH', 'DELETE'].includes(apiConfig.value.apiMethod)
//   ) {
//     headers['Digest'] = `SHA-256=${debugInfo.value.bodyDigest}`
//   }

//   const requestOptions: RequestInit = {
//     method: apiConfig.value.apiMethod,
//     headers,
//     mode: 'cors',
//   }

//   if (apiConfig.value.requestBody && apiConfig.value.apiMethod !== 'GET') {
//     requestOptions.body = apiConfig.value.requestBody
//   }

//   try {
//     const res = await fetch(apiConfig.value.apiUrl, requestOptions)
//     const rawText = await res.text()

//     let parsedData
//     try {
//       parsedData = JSON.parse(rawText)
//     } catch {
//       parsedData = rawText
//     }

//     response.value = {
//       success: res.ok,
//       status: `${res.status} ${res.statusText}`,
//       data: JSON.stringify(parsedData, null, 2),
//       headers: JSON.stringify(Object.fromEntries(res.headers.entries()), null, 2),
//     }
//   } catch (e: any) {
//     response.value = {
//       success: false,
//       status: 'Error',
//       data: e.message,
//       headers: null,
//     }
//   }
//   console.log(response.value)
// }

// //clear all fields
// function clearAll() {
//   apiConfig.value.clientId = ''
//   apiConfig.value.clientSecret = ''
//   apiConfig.value.requestBody = ''
//   debugInfo.value = {}
//   response.value = {}
// }
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-gray-100 font-sans">
    <div class="sticky top-0">
      <HeaderElement></HeaderElement>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
    <!-- <div
      class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-2"
    >
      <h1 class="text-3xl font-bold">🔐 Mekari Upload Document HMAC</h1>
      <br />
      <hr class="text-neutral-600 py-2" />

      <div class="form-start">
        <FormInput
          type="text"
          placeholder="https://sandbox-api.mekari.com/v2/esign-hmac/v1/profile"
          v-model="apiConfig.apiUrl"
        >
          <template v-slot:label>Full API URL :</template>
        </FormInput>

        <FormSelect :options="methodsExport">
          <template v-slot:label>HTTP Method :</template></FormSelect
        >

        <FormInput type="text" placeholder="Your Client ID" v-model="apiConfig.clientId">
          <template v-slot:label>Client ID :</template>
        </FormInput>

        <FormInput
          type="text"
          placeholder="Your Client Secret Key"
          v-model="apiConfig.clientSecret"
        >
          <template v-slot:label>Client Secret :</template>
        </FormInput>

        <br />
        <hr class="text-neutral-600 p-2" />

        <FormInputArea placeholder='{"key": "value"}' v-model="apiConfig.requestBody">
          <template v-slot:label>Request Body (JSON) : </template>
        </FormInputArea>

        <FormInputArea
          placeholder='{"Content-Type": "application/json"}'
          v-model="apiConfig.additionalHeaders"
        >
          <template v-slot:label>Additional Headers :</template>
        </FormInputArea>
      </div>
      <div class="button-group grid grid-cols-1 sm:grid-cols-2 justify-between gap-5 py-2">
        <button @click="generateSignature" class="bg-green-700 p-2 rounded-lg flex-2 col-span-2">
          🔐 Generate HMAC Signature & Digest
        </button>
        <button class="bg-blue-700 p-2 rounded-lg flex-2">🔍 Generate Digest</button>
        <button @click="sendRequest" class="bg-yellow-700 p-2 rounded-lg flex-2">
          🚀 Send Request to Mekari HMAC
        </button>
        <button @click="clearAll" class="bg-red-700 p-2 rounded-lg flex-1">🗑️ Clear All</button>
      </div>
    </div>

    <div class="flex flex-col flex-2 gap-5">
      <div
        id="debug_info"
        class="p-6 bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-1"
      >
        <h3 class="text-xl font-bold">🔍 Debug Information</h3>
        <br />
        <hr class="text-neutral-600 py-2" />

        <div class="flex flex-col gap-2">
          <DebugItem :data="debugInfo?.dateFormat">
            <template v-slot:label>Generated Date :</template>
          </DebugItem>
          <DebugItem :data="debugInfo?.requestLine">
            <template v-slot:label>Request Line :</template>
          </DebugItem>
          <DebugItem :data="debugInfo?.stringToSign">
            <template v-slot:label>String to Sign :</template>
          </DebugItem>
          <DebugItem :data="debugInfo?.stringToSignJson">
            <template v-slot:label>String to Sign (JSON) :</template>
          </DebugItem>
          <DebugItem :data="debugInfo?.signature">
            <template v-slot:label>Header Signature :</template>
          </DebugItem>
          <DebugItem :data="debugInfo?.bodyDigest">
            <template v-slot:label>Body Digest :</template>
          </DebugItem>
        </div>
      </div>
      <div
        id="API_resp_info"
        class="p-6 bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-1"
      >
        <h3 class="text-xl font-bold">📡 API Response</h3>
        <br />
        <hr class="text-neutral-600 py-2" />
        {{ response.value }}
      </div>
    </div> -->

    <!-- CONTAINER WRAPPER DIV END -->
  </div>
</template>

<!-- <div class="h-screen w-screen bg-black flex flex-col overflow-x-hidden">
    <header
      class="flex align-middle z-20 bg-neutral-800 sticky top-0 text-white px-6 py-4 max-h-[10vh]"
    >
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </header>
    <div class="bg-neutral-900 top-0 z-0 w-screen px-6 text-white">
      <RouterView />
    </div>
  </div> -->
