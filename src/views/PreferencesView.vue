<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Your Preferences</h1>
      <p class="mt-2 text-gray-600">Customize your news feed by selecting your favorite categories and sources</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
        <p class="text-sm text-gray-600 mb-4">Select the news categories you're interested in</p>
        
        <div v-if="loading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="category in allCategories"
            :key="category.value"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <span class="text-sm font-medium text-gray-900">{{ category.display_name }}</span>
            <button
              @click="toggleCategory(category.value)"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                selectedCategories.includes(category.value)
                  ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ selectedCategories.includes(category.value) ? 'Selected' : 'Select' }}
            </button>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Sources</h2>
        <p class="text-sm text-gray-600 mb-4">Choose your preferred news sources</p>
        
        <div v-if="loading" class="flex justify-center py-4">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="source in allSources"
            :key="source.value"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <span class="text-sm font-medium text-gray-900">{{ source.display_name }}</span>
            <button
              @click="toggleSource(source.value)"
              :class="[
                'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                selectedSources.includes(source.value)
                  ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ selectedSources.includes(source.value) ? 'Selected' : 'Select' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Selected Preferences</h2>
      
      <div v-if="!hasPreferences" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No preferences selected</h3>
        <p class="mt-1 text-sm text-gray-500">Select categories and sources above to personalize your news feed.</p>
      </div>
      
      <div v-else class="space-y-4">
        <div v-if="!loading && selectedCategories.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Selected Categories</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in selectedCategories"
              :key="category"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
            >
              {{ getCategoryDisplayName(category) }}
              <button
                @click="removeCategory(category)"
                class="ml-2 text-primary-600 hover:text-primary-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
              <button
                @click="removeSource(source)"
                class="ml-2 text-green-600 hover:text-green-800"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <router-link to="/" class="btn-secondary">
        Back to Home
      </router-link>
      
      <button
        @click="savePreferences"
        :disabled="loading"
        class="btn-primary"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ loading ? 'Saving...' : 'Save Preferences' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserPreferencesStore } from '@/store/userPreferences'
import { useRouter } from 'vue-router'

const userPreferencesStore = useUserPreferencesStore()
const router = useRouter()

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

const toggleCategory = async (category: string) => {
  try {
    if (selectedCategories.value.includes(category)) {
      await userPreferencesStore.removeCategory(category)
    } else {
      await userPreferencesStore.addCategory(category)
    }
  } catch (error: any) {
    console.error('Failed to update category:', error)
  }
}

const toggleSource = async (source: string) => {
  try {
    if (selectedSources.value.includes(source)) {
      await userPreferencesStore.removeSource(source)
    } else {
      await userPreferencesStore.addSource(source)
    }
  } catch (error: any) {
    console.error('Failed to update source:', error)
  }
}

const removeCategory = async (category: string) => {
  try {
    await userPreferencesStore.removeCategory(category)
  } catch (error: any) {
    console.error('Failed to remove category:', error)
  }
}

const removeSource = async (source: string) => {
  try {
    await userPreferencesStore.removeSource(source)
  } catch (error: any) {
    console.error('Failed to remove source:', error)
  }
}

const savePreferences = async () => {
  try {
    await userPreferencesStore.updatePreferences()
    router.push('/')
  } catch (error: any) {
    console.error('Failed to save preferences:', error)
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
