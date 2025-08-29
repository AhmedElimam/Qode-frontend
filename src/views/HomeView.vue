<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Your News Feed</h1>
        <p class="mt-2 text-gray-600">Stay updated with your personalized news</p>
      </div>
      
      <div class="flex space-x-3">
        <button
          @click="loadPersonalizedArticles"
          :disabled="loading"
          class="btn-primary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        
        <router-link to="/search" class="btn-secondary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </router-link>
      </div>
    </div>

    <div v-if="!hasPreferences" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <h3 class="text-lg font-medium text-yellow-800">Set up your preferences</h3>
          <p class="mt-1 text-yellow-700">Choose your favorite categories and sources to get personalized news.</p>
          <router-link to="/preferences" class="mt-3 inline-flex items-center text-yellow-800 hover:text-yellow-900 font-medium">
            Go to preferences
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="!hasArticles" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your preferences or search for specific topics.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="viewArticle(article)"
      />
    </div>

    <div v-if="hasArticles && pagination.totalPages > 1" class="flex justify-center">
      <nav class="flex items-center space-x-2">
        <button
          @click="changePage(pagination.currentPage - 1)"
          :disabled="pagination.currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span class="px-3 py-2 text-sm text-gray-700">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
        </span>
        
        <button
          @click="changePage(pagination.currentPage + 1)"
          :disabled="pagination.currentPage === pagination.totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useArticlesStore } from '@/store/articles'
import { useUserPreferencesStore } from '@/store/userPreferences'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'

const articlesStore = useArticlesStore()
const userPreferencesStore = useUserPreferencesStore()
const authStore = useAuthStore()
const router = useRouter()

const articles = computed(() => articlesStore.allArticles)
const loading = computed(() => articlesStore.isLoading)
const hasArticles = computed(() => articlesStore.hasArticles)
const pagination = computed(() => articlesStore.$state.pagination)
const hasPreferences = computed(() => userPreferencesStore.hasPreferences)
const isAuthenticated = computed(() => authStore.isLoggedIn)

const loadPersonalizedArticles = async () => {
  try {
    await articlesStore.fetchPersonalizedArticles(1)
  } catch (error: any) {
    console.error('Failed to load articles:', error)
  }
}

const changePage = async (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) return
  
  try {
    await articlesStore.fetchPersonalizedArticles(page)
  } catch (error: any) {
    console.error('Failed to load articles:', error)
  }
}

const viewArticle = (article: any) => {
  router.push(`/article/${article.id}`)
}

onMounted(async () => {
  console.log('HomeView mounted, isAuthenticated:', isAuthenticated.value, 'hasPreferences:', hasPreferences.value)
  
  if (isAuthenticated.value) {
    await loadPersonalizedArticles()
  }
})

watch(isAuthenticated, async (newIsAuthenticated, oldIsAuthenticated) => {
  console.log('Authentication changed:', { old: oldIsAuthenticated, new: newIsAuthenticated })
  if (newIsAuthenticated && !oldIsAuthenticated) {
    await loadPersonalizedArticles()
  }
})

watch(hasPreferences, async (newHasPreferences, oldHasPreferences) => {
  console.log('hasPreferences changed:', { old: oldHasPreferences, new: newHasPreferences })
  if (newHasPreferences && !oldHasPreferences && isAuthenticated.value) {
    await loadPersonalizedArticles()
  }
})
</script>