<script setup lang="ts">
import { ref } from 'vue'
import api from '@/./api/index.js'

const loading = ref(false)
const error = ref<string | null>(null)

const postSignDocument = async () => {
  loading.value = true

  //build form data
  try {
    const payload = {
      doc: 'JVBERi0xLjQKJf//////AAAAAAo', // Base64 PDF
      filename: 'filename_2.pdf',
      signers: [
        {
          name: 'Signer 1',
          email: 'egatesting1@yopmail.com',
          phone_number: {
            country_code: '62',
            number: '+6282103452716',
          },
          annotations: [
            {
              type_of: 'signature',
              page: 1,
              position_x: 40,
              position_y: 40,
              element_width: 120,
              element_height: 100,
              canvas_width: 595,
              canvas_height: 841,
              auto_fields: ['date_signed', 'name', 'email', 'company'],
            },
            {
              type_of: 'meterai',
              page: 1,
              position_x: 40,
              position_y: 40,
              element_width: 120,
              element_height: 100,
              canvas_width: 595,
              canvas_height: 841,
              meterai_provided: true,
            },
          ],
        },
      ],
      signing_order: false,
      callback_url: 'https://8588cd144a04.ngrok-free.app/documents/callback',
      is_signature_without_frame: false,
    }

    const response = await api.post(`/requestSign`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('Request Sign Successful : ', response.data)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to Request Sign '
    console.error('Request Sign error!')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div
    id="container"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono"
  >
    <div class="mx-auto flex justify-center gap-2 flex-col">
      <div class="pb-2">
        <h1 class="text-xl font-bold text-gray-200">Sign Document</h1>
        <p class="text-sm text-gray-500">Upload a document to be signed</p>
      </div>
      <div class="flex flex-row gap-5 py-3 px-2 rounded-md border-1 border-gray-500 border-dashed">
        <button
          class="cursor-pointer bg-blue-600 hover:bg-blue-300 disabled:bg-gray-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="postSignDocument()"
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
          <span v-else>Sign Document (Dummy Data)</span>
        </button>
      </div>
    </div>
  </div>
</template>
