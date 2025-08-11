<script setup lang="ts">
import { ref } from 'vue'
import api from '@/./api/index.js'

const file = ref<File | null>(null)
const comply_psre = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

//event.target handle for file input element.
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

//Toggle Psre
function togglePsre() {
  comply_psre.value = !comply_psre.value
  console.log(comply_psre.value)
}

const postUploadDocument = async () => {
  if (!file.value) return
  loading.value = true

  //build form data
  try {
    const formData = new FormData()
    formData.append('doc', file.value)
    formData.append('comply_psre', String(comply_psre.value))

    // const callbackUrl = `${window.location.origin}/api/documents/callback`
    // formData.append('callback', callbackUrl)
    // if (callbackUrl) {
    //   formData.append('callback', callbackUrl)
    // }

    //request to backend
    const response = await api.post(`/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Upload successful:', response.data)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to Upload file'
    console.error('Document upload error!')
  } finally {
    loading.value = false
    file.value = null
  }
}
</script>
<template>
  <div
    id="container"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono"
  >
    <div class="mx-auto flex justify-center gap-2 flex-col">
      <!-- Header -->
      <div class="pb-2">
        <h1 class="text-xl font-bold text-gray-200">Upload Document</h1>
        <p class="text-sm text-gray-500">Upload a signed document</p>
      </div>

      <!-- Toggle PSRE box -->
      <div class="flex flex-row gap-5 py-3 px-2 rounded-md border-1 border-gray-500 border-dashed">
        <!-- Toggle Switch -->
        <button
          @click="togglePsre"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            comply_psre ? 'bg-blue-500' : 'bg-neutral-700',
          ]"
          role="switch"
        >
          <!-- Toggle Circle -->
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
              comply_psre ? 'translate-x-6' : 'translate-x-1',
            ]"
          ></span>
        </button>

        <label
          @click="togglePsre"
          class="text-sm font-medium text-gray-300 cursor-pointer select-none pt-1"
        >
          Comply with Psre?
        </label>
      </div>

      <!-- Upload Box -- TODO : Add drag and drop function -->
      <label
        class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition"
      >
        <input type="file" class="hidden" accept=".pdf" @change="handleFileChange" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 text-gray-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
        <p class="text-sm font-medium text-gray-700">Drop your PDF here or click to browse</p>
        <p class="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
      </label>

      <!-- File Preview -->
      <div
        v-if="file"
        class="mt-4 p-3 bg-neutral-900 border-dashed border-1 border-gray-600 rounded-md"
      >
        <p class="text-sm font-medium text-gray-200">{{ file.name }}</p>
        <p class="text-xs text-gray-400">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
      </div>
    </div>
    <!-- Upload Button -->
    <div class="pt-5 flex justify-end" v-if="file">
      <button
        :disabled="loading || !file"
        class="cursor-pointer bg-blue-600 hover:bg-blue-300 disabled:bg-gray-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="file && !loading && postUploadDocument()"
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
        <span v-else>Upload Document</span>
      </button>
    </div>
  </div>
</template>
