<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, computed } from 'vue'

const input = ref('')
const digest = computed(() => {})

const apiUrl = ref('')
const apiMethod = ref('')
const clientId = ref('')
const clientSecret = ref('')
const requestBody = ref('')
const additionalHeaders = ref('{"Content-Type": "application/json"}')
const debugInfo = ref(null)
const response = ref(null)
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-gray-100 font-sans p-2 flex flex-row gap-5">
    <div
      class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-2"
    >
      <h1 class="text-3xl font-bold">🔐 Mekari E-sign HMAC API Tester</h1>
      <br />
      <hr class="text-neutral-600 py-2" />

      <div class="form-start">
        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>Full API URL : </label>
          <input
            v-model="apiUrl"
            type="text"
            placeholder="https://sandbox-api.mekari.com/v2/esign-hmac/v1/profile"
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          />
        </div>

        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>HTTP Method:</label>
          <select
            v-model="apiMethod"
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>Client ID : </label>
          <input
            v-model="clientId"
            type="text"
            placeholder="Your Client ID"
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          />
        </div>

        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>Client Secret : </label>
          <input
            v-model="clientId"
            type="text"
            placeholder="Your Client Secret Key"
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          />
        </div>

        <br />
        <hr class="text-neutral-600 p-2" />

        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>Request Body (JSON) : </label>
          <textarea
            v-model="clientId"
            type="text"
            placeholder='{"key": "value"}'
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          ></textarea>
        </div>

        <div class="flex flex-col max-w-[1080px] m-2 py-2 gap-2">
          <label>Additional Headers : </label>
          <textarea
            v-model="clientId"
            type="text"
            placeholder='{"Content-Type": "application/json"}'
            class="rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
          ></textarea>
        </div>
      </div>
      <div class="button-group flex flex-row justify-between gap-5 py-2">
        <button class="bg-green-700 p-2 rounded-lg flex-2">🔐 Generate HMAC Signature</button>
        <button class="bg-blue-700 p-2 rounded-lg flex-2">🔍 Generate Digest</button>
        <button class="bg-yellow-700 p-2 rounded-lg flex-2">🚀 Send Request to Mekari HMAC</button>
        <button class="bg-red-700 p-2 rounded-lg flex-1">🗑️ Clear All</button>
      </div>
    </div>
    <!-- ============================= -->
    <div
      v-if="!debugInfo"
      class="p-6 w-full bg-neutral-900 border-1 border-neutral-600 border-dashed rounded-lg flex-1"
    >
      <h3 class="text-xl font-bold">🔍 Debug Information</h3>
      <br />
      <hr class="text-neutral-600 py-2" />

      <div class="border-s-4 border-blue-600"><strong>Generated Date:</strong></div>
      <div class="border-s-4 border-blue-600"><strong>Request Line:</strong></div>
      <div class="border-s-4 border-blue-600">
        <strong>String to Sign:</strong>
        <div class="code-block"></div>
      </div>
      <div class="border-s-4 border-blue-600">
        <strong>String to Sign (JSON):</strong>
        <div class="code-block"></div>
      </div>
      <div class="border-s-4 border-blue-600"><strong>Generated Signature:</strong></div>
      <div class="border-s-4 border-blue-600"><strong>Body Digest:</strong></div>
      <div class="border-s-4 border-blue-600">
        <strong>Authorization Header:</strong>
        <div class="code-block"></div>
      </div>
    </div>
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
