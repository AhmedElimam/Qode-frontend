<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
      <p class="mt-2 text-gray-600">Manage your account information</p>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
      
      <div v-if="currentUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-sm text-gray-900">{{ currentUser.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm text-gray-900">{{ currentUser.email }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Member since</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(currentUser.created_at) }}</p>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Preferences Summary</h2>
      
      <div v-if="hasPreferences" class="space-y-4">
        <div v-if="!loading && selectedCategories.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Selected Categories</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in selectedCategories"
              :key="category"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
            >
              {{ getCategoryDisplayName(category) }}
            </span>
          </div>
        </div>
        
        <div v-if="!loading && selectedSources.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Selected Sources</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="source in selectedSources"
              :key="source"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
            >
              {{ getSourceDisplayName(source) }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-4">
        <p class="text-sm text-gray-500">No preferences set yet.</p>
        <router-link to="/preferences" class="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
          Set up preferences
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <router-link to="/preferences" class="btn-secondary">
        Edit Preferences
      </router-link>
      
      <button
        @click="handleLogout"
        class="btn-primary bg-red-600 hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUserPreferencesStore } from '@/store/userPreferences'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const userPreferencesStore = useUserPreferencesStore()
const router = useRouter()

const currentUser = computed(() => authStore.currentUser)
const loading = computed(() => userPreferencesStore.isLoading)
const allCategories = computed(() => userPreferencesStore.allCategories)
const allSources = computed(() => userPreferencesStore.allSources)
const selectedCategories = computed(() => userPreferencesStore.$state.selectedCategories)
const selectedSources = computed(() => userPreferencesStore.$state.selectedSources)
const hasPreferences = computed(() => userPreferencesStore.hasPreferences)

const getCategoryDisplayName = (category: string) => {
  if (!category) return ''
  const categoryObj = allCategories.value.find(cat => cat.value === category)
  return categoryObj?.display_name || category.charAt(0).toUpperCase() + category.slice(1)
}

const getSourceDisplayName = (source: string) => {
  if (!source) return ''
  const sourceObj = allSources.value.find(src => src.value === source)
  if (sourceObj) {
    return sourceObj.display_name
  }
  try {
    return source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  } catch (error) {
    return source || 'Unknown Source'
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error: any) {
    console.error('Logout failed:', error)
  }
}

onMounted(async () => {
  try {
    await userPreferencesStore.fetchCategories()
    await userPreferencesStore.fetchSources()
    await userPreferencesStore.fetchUserPreferences()
  } catch (error: any) {
    console.error('Failed to load preferences:', error)
  }
})
</script>
