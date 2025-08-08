<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { Document, DocumentFilters } from '@/types/docListTypes'
import api from '@/./api/index.js'

//TEST JSON DATA
import testDataDocuments from '@/data/JSON/testDocumentsList.json'

// Reactive data
// const documents = ref<Document[]>([])
const documents = ref<Document[]>(testDataDocuments.data)
// console.log(documents.value)
const loading = ref(false)
const error = ref<string | null>(null)

const filters = reactive<DocumentFilters>({
  page: 1,
  limit: 8,
  category: '',
  signing_status: '',
  stamping_status: '',
})

const getDocumentData = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/documents')
    // documents.value = response.data
    console.log('documents response')
    console.log(response.data)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to fetch documents data'
    console.error('Documents List fetch error!')
  } finally {
    loading.value = false
  }
}

// const getStampingStatusClass = (status: string): string => {
//   const statusClasses: Record<string, string> = {
//     success: 'bg-green-100 text-green-800',
//     pending: 'bg-yellow-100 text-yellow-800',
//     in_progress: 'bg-blue-100 text-blue-800',
//     failed: 'bg-red-100 text-red-800',
//     none: 'bg-gray-100 text-gray-800',
//   }
//   return statusClasses[status] || 'bg-gray-100 text-gray-800'
// }

// const formatStatus = (status: string): string => {
//   return status
//     .split('_')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ')
// }

// Load initial data
onMounted(async () => {
  try {
    getDocumentData()
  } catch (err: any) {
    error.value = err
    console.error(err)
  } finally {
    loading.value = false
  }
})

//Debug
watch(filters, (filtersDebug) => {
  console.log(filtersDebug)
})
</script>

<template>
  <div
    id="container"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono"
  >
    <div class="mx-auto flex justify-center gap-2 flex-col">
      <!-- Header -->
      <div class="pb-2">
        <h1 class="text-xl font-bold text-gray-200">Document List</h1>
        <p class="text-sm text-gray-500">Browse and filter your documents</p>
      </div>

      <!-- Filters Card -->
      <div class="border-1 border-neutral-600 border-dashed rounded-lg shadow p-5 w-full">
        <h2 class="text-lg font-semibold text-gray-200 mb-4">Filters</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Page Input -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Page</label>
            <input
              type="number"
              min="1"
              v-model="filters.page"
              class="w-full rounded-md border-1 border-neutral-600 py-1 px-3 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              placeholder="1"
            />
          </div>

          <!-- Limit Input -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Limit</label>
            <input
              type="number"
              min="1"
              max="100"
              v-model="filters.limit"
              class="w-full rounded-md border-1 border-neutral-600 py-1 px-3 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              placeholder="8"
            />
          </div>

          <!-- Category Select -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              v-model="filters.category"
            >
              <option value="">All Categories</option>
              <option value="psre">PSRE</option>
              <option value="global">Global</option>
            </select>
          </div>

          <!-- Signing Status Select -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Signing Status</label>
            <select
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              v-model="filters.signing_status"
            >
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="voided">Voided</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <!-- Stamping Status Filter -->
          <div class="col-span-2 md:col-span-4">
            <label class="block text-sm font-medium text-gray-400 mb-1">Stamping Status</label>
            <select
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              v-model="filters.stamping_status"
            >
              <option value="">All Stamping Statuses</option>
              <option value="none">None</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>

        <!-- Search Button -->
        <div class="pt-5 flex justify-end">
          <button
            :disabled="loading"
            class="cursor-pointer bg-blue-600 hover:bg-blue-300 disabled:bg-gray-700 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
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
            <span v-else>Search Documents</span>
          </button>
        </div>
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
            <h3 class="text-sm font-medium text-neutral-300 inline">Error :</h3>
            <span class="pl-3 text-sm text-neutral-500"> {{ error }}</span>
          </div>
        </div>
      </div>

      <!-- Documents Grid -->
      <div v-if="documents.length > 0" class="rounded-lg shadow">
        <div class="rounded-lg shadow border-1 border-dashed border-neutral-600">
          <div class="px-6 py-4 border-gray-200">
            <h3 class="text-lg font-medium text-neutral-300">
              Documents ({{ documents.length }} results)
            </h3>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="document in documents"
              :key="document?.id"
              class="p-6 hover:bg-gray-800 transition-colors duration-150"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-neutral-300 mb-2">
                    {{ document?.attributes?.filename }}
                  </h4>
                  <div class="grid grid-cols-1 text-sm text-gray-500">
                    <div class="mt-3 text-sm text-gray-200">
                      <span class="font-medium">ID:</span> {{ document?.id }}
                    </div>
                    <div>
                      <span class="font-medium">Category:</span>
                      <span class="ml-1 px-2 py-1 rounded-full text-xs">
                        <!-- {{ document.attributes.category. }} -->
                        {{ document?.attributes?.category }}
                      </span>
                    </div>
                    <div>
                      <span class="font-medium">Signing Status:</span>
                      <span class="ml-1 px-2 py-1 rounded-full text-xs">
                        <!--  :class="getStatusClass(document.attributes.signing_status)" -->
                        <!-- {{ formatStatus(document.attributes.signing_status) }} -->
                        {{ document?.attributes?.signing_status }}
                      </span>
                    </div>
                    <div>
                      <span class="font-medium">Stamping Status:</span>
                      <span class="ml-1 px-2 py-1 rounded-full text-xs">
                        <!-- {{ formatStatus(document.attributes.stamping_status) }} -->
                        {{ document?.attributes?.stamping_status }}
                      </span>
                    </div>
                    <div v-if="document?.attributes?.signers.length > 1">
                      <span class="font-medium pr-2">Signers :</span>
                      <span
                        v-for="(signer, index) in document?.attributes?.signers"
                        class="pl-2 rounded-full text-xs"
                      >
                        {{ signer.name
                        }}<span v-if="index !== document?.attributes?.signers.length - 1">,</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="ml-4">
                  <!-- <a
                    :href="document?.attributes?.doc_url"
                    target="_blank"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  > -->
                  <RouterLink
                    :to="{ name: 'documents_detail', params: { id: document.id } }"
                    class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Icon icon="line-md:cog" style="font-size: 21px" />

                    <div
                      class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
                    >
                      Profile Config
                    </div>
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    View Document
                  </RouterLink>
                  <!-- </a> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error" class="text-center py-12">
        <div class="text-center py-10 border-1 border-dashed border-gray-600 rounded-md">
          <h3 class="mt-4 text-lg font-medium text-gray-300">No documents found</h3>
          <p class="mt-2 text-gray-400">Try adjusting your filters and search again.</p>
        </div>
      </div>
    </div>
  </div>
</template>
