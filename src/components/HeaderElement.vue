<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/./api/index.js'
import { Icon } from '@iconify/vue'
// import { useTokenStore } from '@/stores/tokenStore'

//Reactive data
const profile = ref<any>(null)
const loading = ref(false)
const error = ref('')

const isSidebarOpen = ref(false)

//Function to fetch profile
const fetchProfile = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/MekariProfile')
    profile.value = response.data
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to fetch profile'
    console.error('Profile fetch error!')
  } finally {
    loading.value = false
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  fetchProfile()
})
</script>
<template>
  <div
    class="px-1 pb-5 pt-2 border-r-1 border-dashed border-neutral-600 bg-neutral-900 w-12 text-gray-100 h-screen text-center flex flex-col justify-between"
  >
    <div id="top-icons">
      <div
        class="font-mono group relative hover:bg-neutral-800 transition-all duration-200 py-2 px-2 rounded-md inline-block cursor-pointer"
      >
        <Icon
          icon="line-md:arrow-close-right"
          style="font-size: 18px"
          class="group-hover:hidden group-hover:opacity-0 text-neutral-500"
        ></Icon>
        <Icon
          icon="line-md:close-to-menu-transition"
          style="font-size: 18px"
          class="hidden opacity-0 group-hover:block group-hover:opacity-100 text-neutral-300"
        ></Icon>

        <!-- Tooltip -->
        <div
          class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
        >
          Open Sidebar
        </div>
      </div>
      <div class="flex flex-col items-center gap-2 justify-center pt-10">
        <RouterLink
          :to="{ name: 'config' }"
          class="relative group font-bold font-mono text-blue-200 gap-2 hover:bg-neutral-800 p-1 rounded-md"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 21px" />

          <div
            class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
          >
            Profile Config
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'list-documents' }"
          class="relative group font-bold font-mono text-blue-200 gap-2 hover:bg-neutral-800 p-1 rounded-md"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:clipboard-list" style="font-size: 21px" />
          <div
            class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
          >
            Document Lists
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'upload-documents' }"
          class="relative group font-bold font-mono text-blue-200 gap-2 hover:bg-neutral-800 p-1 rounded-md"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cloud-alt-upload" style="font-size: 21px" />
          <div
            class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
          >
            Upload Document
          </div>
        </RouterLink>
      </div>
    </div>
    <div id="bottom-icons" class="pt-10">
      <div class="group relative flex flex-col items-center gap-2 justify-center font-mono">
        <Icon icon="material-symbols:account-circle" style="font-size: 21px"> </Icon>
        <div
          class="absolute left-9 top-1/2 -translate-y-1/2 bg-blue-500 text-white text-md px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50"
        >
          <div class="flex flex-row gap-2">
            <span v-if="profile">
              {{ profile?.data?.attributes?.full_name }}
            </span>
            <span v-else> No Profile Loaded.</span>
          </div>
          <div class="text-xs">
            <span v-if="profile" class="truncate overflow-hidden">
              {{ profile?.data?.attributes?.email }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div
    class="p-1 border-1 bg-red-500 border-neutral-600 border-dashed flex-2 text-gray-100 h-screen w-12 overflow-hidden justify-center align-middle"
  >
    <div class="flex flex-col bg-red-400 align-middle justify-end gap-5">
      <div class="p-1 rounded-md bg-neutral-800 inline-flex">
        <Icon icon="line-md:arrow-close-right" @hover="" style="font-size: 18px"></Icon>
      </div>

      <div class="flex flex-col gap-3">
        <RouterLink
          :to="{ name: 'config' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 21px" />
        </RouterLink>
        <RouterLink
          :to="{ name: 'list-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:clipboard-list" style="font-size: 21px" />
        </RouterLink>
        <RouterLink
          :to="{ name: 'upload-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cloud-alt-upload" style="font-size: 21px" />
        </RouterLink>
      </div>
    </div>
  </div> -->
  <!-- <div
    class="p-6 border-1 bg-neutral-900 border-neutral-600 border-dashed flex-2 text-gray-100 flex flex-row gap-5 justify-between align-middle"
  >
    <div class="flex flex-row gap-5">
      <h1 class="font-bold">🔐 Uploadis</h1>
      <div class="flex px-6 gap-7">
        <RouterLink
          :to="{ name: 'config' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cog" style="font-size: 28px" />
          <h1>Profile Config</h1>
        </RouterLink>
        <RouterLink
          :to="{ name: 'list-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:clipboard-list" style="font-size: 28px" />
          <h1>Get Document List</h1>
        </RouterLink>
        <RouterLink
          :to="{ name: 'upload-documents' }"
          class="font-bold font-mono text-blue-200 flex gap-2 align-middle"
          activeClass="underline text-blue-400"
        >
          <Icon icon="line-md:cloud-alt-upload" style="font-size: 28px" />
          <h1>Upload Document</h1>
        </RouterLink>
      </div>
    </div>
    <div class="font-bold font-mono">
      <div class="flex flex-row gap-2">
        <Icon icon="line-md:account" style="font-size: 24px"> </Icon>
        <span v-if="profile">
          {{ profile?.data?.attributes?.full_name }}
        </span>
        <span v-else> Loading.... </span>
      </div>
      <div class="text-xs">
        <span v-if="profile" class="truncate overflow-hidden">
          {{ profile?.data?.attributes?.email }}
        </span>
      </div>
    </div>
  </div> -->
</template>
