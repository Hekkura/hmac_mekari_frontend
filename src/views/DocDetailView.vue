<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { DocumentDetail, DocumentAttributes } from '@/types/docDetailTypes'
import api from '@/./api/index.js'

//TEST JSON DATA
import testDetailDocument from '@/data/JSON/testDocumentDetail.json'

//Reactive Data
// const documentDetail = ref<DocumentDetail[]>([])
const documentDetail = ref<DocumentDetail | null>(testDetailDocument.data)
const loading = ref(false)
const error = ref<string | null>(null)

const route = useRoute()
const id = route.params.id as string

const getDocumentDetail = async (id: string) => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/documents/${id}`)
    // documentDetail.value = response.data
    console.log('document detail response')
    console.log(response.data)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to fetch detail data'
    console.error('Documents Detail fetch error!')
    // documentDetail.value = null
  } finally {
    loading.value = false
  }
}

const getDocumentDownload = async (id: string) => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/download-pdf/${id}`)
    console.log('document detail response')
    console.log(response.data)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to download file'
    console.error('Documents Download error!')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    getDocumentDetail(id)
  } catch (err: any) {
    error.value = err
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div
    id="container"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono flex flex-col gap-5"
  >
    <div class="mx-auto flex justify-center gap-2 flex-col" v-if="documentDetail">
      <!-- Header -->
      <div class="pb-2">
        <h1 class="text-xl font-bold text-gray-200">{{ documentDetail?.attributes?.filename }}</h1>
        <p class="text-sm text-gray-500">ID : {{ documentDetail?.id }}</p>
        <!-- <p class="text-sm text-gray-500">
          Last updated at : {{ documentDetail?.attributes.updated_at }}
        </p> -->
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-900 border-1 border-red-400 border-dashed rounded-md p-4 mb-6"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-200" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="pl-3">
            <h2>Document Detail Unavailable</h2>
            <h3 class="text-sm font-medium text-neutral-300 inline">Error :</h3>
            <span class="pl-3 text-sm text-neutral-500"> {{ error }}</span>
          </div>
        </div>
      </div>

      <!-- main attributes Card -->
      <!-- Download Button -->
      <!-- {{ documentDetail }} -->
      <div class="pt-2 flex justify-start">
        <!-- @click="getDocumentDownload(documentDetail.id)" -->
        <button
          :disabled="loading || !documentDetail"
          @click="getDocumentDownload(documentDetail.id)"
          class="cursor-pointer bg-blue-600 hover:bg-blue-300 disabled:bg-gray-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <span v-else>Download Document</span>
        </button>
      </div>

      <div class="border-1 border-neutral-600 border-dashed rounded-lg shadow p-5 w-full">
        <h2 class="text-lg font-semibold text-gray-200 mb-4">Overview</h2>
        <!-- <div class="divide-y divide-gray-200"> -->

        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="grid grid-cols-1 text-sm text-gray-500">
              <div class="mt-3 text-sm text-gray-400">
                <span class="font-medium">Signing Status:</span>
                {{ documentDetail?.attributes.signing_status }}
              </div>
              <div class="mt-3 text-sm text-gray-400">
                <span class="font-medium">Stamping Status:</span>
                <span class="ml-1 px-2 py-1 rounded-full text-xs">
                  {{ documentDetail?.attributes.stamping_status }}
                </span>
              </div>
              <div class="mt-3 text-sm text-gray-400">
                <span class="font-medium">Category:</span>
                <span class="ml-1 px-2 py-1 rounded-full text-xs">
                  {{ documentDetail?.attributes.category }}
                </span>
              </div>

              <div class="mt-3 text-sm text-gray-400">
                <span class="font-medium"> Last updated at :</span>
                <span class="ml-1 px-2 py-1 rounded-full text-xs">
                  {{ documentDetail?.attributes.updated_at }}
                </span>
              </div>
              <div class="mt-3 text-sm text-gray-400">
                <span class="font-medium"> Created at :</span>
                <span class="ml-1 px-2 py-1 rounded-full text-xs">
                  {{ documentDetail?.attributes.created_at }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </div>
      <div class="rounded-lg shadow border-1 border-dashed border-neutral-600">
        <div class="px-6 py-4 border-gray-200">
          <h3 class="text-lg font-medium text-neutral-300">
            {{ documentDetail?.attributes.signers.length }} Signers
          </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="signer in documentDetail?.attributes.signers"
            :key="signer.email"
            class="p-6 hover:bg-gray-800 transition-colors duration-150"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="grid grid-cols-1 text-sm text-gray-500">
                  <div class="mt-3 text-sm text-gray-200">
                    <span class="font-medium">Name:</span> {{ signer.name }}
                  </div>
                  <div>
                    <span class="font-medium">Email:</span>
                    <span class="ml-1 px-2 py-1 rounded-full text-xs">
                      <!--  :class="getStatusClass(document.attributes.signing_status)" -->
                      <!-- {{ formatStatus(document.attributes.signing_status) }} -->
                      {{ signer.email }}
                    </span>
                  </div>
                  <div>
                    <span class="font-medium">Signing Status:</span>
                    <span class="ml-1 px-2 py-1 rounded-full text-xs">
                      <!-- {{ formatStatus(document.attributes.stamping_status) }} -->
                      {{ signer.signing_status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
