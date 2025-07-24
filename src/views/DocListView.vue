<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { HmacAuthService } from '@/ts/hmacAuthService'
import type { Document, DocumentFilters } from '@/types/docListTypes'
import api from '@/api'
import type { ApiConfig } from '@/types/hmacAPITypes'
import { useTokenStore } from '@/stores/tokenStore'

const tokenStore = useTokenStore()

// Types
interface ApiResponse {
  data: Document[]
}

// Reactive data
const documents = ref<Document[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const apiConfig: ApiConfig = {
  apiEndpoint: '/documents',
  apiMethod: 'GET',
  clientId: tokenStore.clientId,
  clientSecret: tokenStore.secretKey,
  // requestBody: '', (GET Request, no body)
  // additionalHeaders: '{"Content-Type": "application/json"}',
}

const filters = reactive<DocumentFilters>({
  page: 1,
  limit: 8,
  category: '',
  signing_status: '',
  stamping_status: '',
})
// Methods
const fetchDocuments = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    //Pre build URL with query params before generating signature
    const queryParams = new URLSearchParams()

    //add non empty filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, String(value))
      }
    })

    const queryString = queryParams.toString()
    const pathQuery = queryString ? `/documents?${queryString}` : `/documents`

    // Generate signature for the complete URL path
    const configWithQuery = {
      ...apiConfig,
      apiUrl: pathQuery,
    }

    let tempHeader = await HmacAuthService.generateSignature(apiConfig)
    let headers = HmacAuthService.buildRequestHeaders(tempHeader)

    console.log(tempHeader)
    console.log(`Auth : ${tempHeader.authHeader}`)
    console.log(`Date: ${tempHeader.dateFormat}`)
    console.log(headers)
    //merge default params with custom params
    const response = await api.get<Document>(`${pathQuery}`, {
      // params: filters,
      headers: headers,
    })
    console.log(response.data)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred while fetching documents'
    console.error('Error fetching documents:', err)
  } finally {
    loading.value = false
  }
}

const getStampingStatusClass = (status: string): string => {
  const statusClasses: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    failed: 'bg-red-100 text-red-800',
    none: 'bg-gray-100 text-gray-800',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Load initial data
onMounted(async () => {
  try {
    fetchDocuments()
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
    id="containerDocList"
    class="min-h-screen bg-neutral-900 border-1 border-neutral-600 border-dashed py-6 px-5 md:px-10 lg:px-15 xl:px-20 font-mono"
  >
    <div class="mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-2 flex-col">
      <!-- Header -->
      <div class="pb-2">
        <h1 class="text-xl font-bold text-gray-200">Document Lists</h1>
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
              v-model.number="filters.page"
              type="number"
              min="1"
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              placeholder="1"
            />
          </div>

          <!-- Limit Input -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Limit</label>
            <input
              v-model.number="filters.limit"
              type="number"
              min="1"
              max="100"
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
              placeholder="8"
            />
          </div>

          <!-- Category Select -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
              v-model="filters.category"
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
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
              v-model="filters.signing_status"
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
            >
              <option value="">All Statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="voided">Voided</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <div class="col-span-2 md:col-span-4">
            <label class="block text-sm font-medium text-gray-400 mb-1">Stamping Status</label>
            <select
              v-model="filters.stamping_status"
              class="w-full rounded-md border-1 border-neutral-600 p-2 hover:border-neutral-400 hover:bg-neutral-700 transition-all duration-500"
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

        <!-- Stamping Status Filter -->

        <!-- Search Button -->
        <div class="pt-5 flex justify-end">
          <button
            @click="fetchDocuments"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-300 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <!-- <div v-if="documents.length > 0" class="bg-white rounded-lg shadow"> -->
      <div class="rounded-lg shadow border-1 border-dashed border-neutral-600">
        <div class="px-6 py-4 border-gray-200">
          <h3 class="text-lg font-medium text-neutral-300">
            Documents ({{ documents.length }} results)
          </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="document in documents"
            :key="document.id"
            class="p-6 hover:bg-gray-800 transition-colors duration-150"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-lg font-medium text-neutral-300 mb-2">
                  {{ document.attributes.filename }}
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div>
                    <span class="font-medium">Category:</span>
                    <span class="ml-1 px-2 py-1 rounded-full text-xs">
                      {{ document.attributes.category }}
                    </span>
                  </div>
                  <div>
                    <span class="font-medium">Signing Status:</span>
                    <span class="ml-1 px-2 py-1 rounded-full text-xs">
                      <!--  :class="getStatusClass(document.attributes.signing_status)" -->
                      {{ formatStatus(document.attributes.signing_status) }}
                      <!-- {{ document.attributes.signing_status }} -->
                    </span>
                  </div>
                  <div v-if="document.attributes.stamping_status">
                    <span class="font-medium">Stamping Status:</span>
                    <span
                      class="ml-1 px-2 py-1 rounded-full text-xs"
                      :class="getStampingStatusClass(document.attributes.stamping_status)"
                    >
                      {{ formatStatus(document.attributes.stamping_status) }}
                      <!-- {{ document.attributes.signing_status }} -->
                    </span>
                  </div>
                </div>
                <div class="mt-3 text-xs text-gray-500">
                  <span class="font-medium">ID:</span> {{ document.id }}
                </div>
              </div>
              <div class="ml-4">
                <a
                  :href="document.attributes.doc_url"
                  target="_blank"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Document
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <!-- <div v-else-if="!loading && !error" class="text-center py-12"> -->
      <div class="text-center py-10 border-1 border-dashed border-gray-600 rounded-md">
        <!-- <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg> -->
        <h3 class="mt-4 text-lg font-medium text-gray-300">No documents found</h3>
        <p class="mt-2 text-gray-400">Try adjusting your filters and search again.</p>
      </div>
    </div>
  </div>
</template>
