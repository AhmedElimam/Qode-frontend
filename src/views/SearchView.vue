<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Search Articles</h1>
      <p class="mt-2 text-gray-600">Find news articles by keyword, category, source, and date</p>
    </div>

    <div class="card p-6">
      <form @submit.prevent="handleSearch" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
              Search keyword
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              class="input-field"
              placeholder="Enter keywords..."
            />
          </div>
          
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              v-model="filters.category"
              class="input-field"
            >
              <option value="">All categories</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.display_name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="source" class="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <select
              id="source"
              v-model="filters.source"
              class="input-field"
            >
              <option value="">All sources</option>
              <option v-for="source in sources" :key="source.value" :value="source.value">
                {{ source.display_name }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="dateFrom" class="block text-sm font-medium text-gray-700 mb-1">
              Date from
            </label>
            <input
              id="dateFrom"
              v-model="filters.dateFrom"
              type="date"
              class="input-field"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label for="dateTo" class="block text-sm font-medium text-gray-700 mb-1">
              Date to
            </label>
            <input
              id="dateTo"
              v-model="filters.dateTo"
              type="date"
              class="input-field"
            />
          </div>
          
          <div class="flex items-end space-x-3">
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary flex-1"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
            
            <button
              type="button"
              @click="clearFilters"
              class="btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Error Message -->
    <div v-if="searchError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-800">{{ searchError }}</p>
      </div>
    </div>

    <div v-if="hasSearched && !loading" class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Found {{ pagination.total }} articles
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Sort by:</span>
        <select
          v-model="sortBy"
          @change="handleSort"
          class="input-field w-auto"
        >
          <option value="published_at">Date</option>
          <option value="title">Title</option>
          <option value="source">Source</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="hasSearched && !hasArticles" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
    </div>



    <div v-if="hasArticles" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="col-span-full mb-4 text-sm text-gray-600">
        Showing {{ articles.length }} articles
      </div>
      <article-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="viewArticle(article)"
      />
    </div>

    <div v-if="hasArticles && pagination.totalPages > 1 && !hasSearched" class="flex justify-center">
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useArticlesStore } from '@/store/articles'
import { useUserPreferencesStore } from '@/store/userPreferences'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/ArticleCard.vue'

const articlesStore = useArticlesStore()
const userPreferencesStore = useUserPreferencesStore()
const router = useRouter()

const loading = ref(false)
const hasSearched = ref(false)
const sortBy = ref('published_at')
const searchError = ref<string | null>(null)

const filters = reactive({
  search: '',
  category: '',
  source: '',
  dateFrom: '',
  dateTo: ''
})

const articles = computed(() => articlesStore.allArticles)
const hasArticles = computed(() => articlesStore.hasArticles)
const pagination = computed(() => articlesStore.$state.pagination)
const categories = computed(() => userPreferencesStore.allCategories)
const sources = computed(() => userPreferencesStore.allSources)



const handleSearch = async () => {
  const hasSearchCriteria = filters.search || filters.category || filters.source || filters.dateFrom || filters.dateTo
  
  if (!hasSearchCriteria) {
    searchError.value = 'Please provide at least one search criteria (keyword, category, source, or date range)'
    return
  }
  
  searchError.value = null
  loading.value = true
  hasSearched.value = true
  
  try {
    await articlesStore.searchArticles(filters)
  } catch (error: any) {
    console.error('Search failed:', error)
    searchError.value = 'Search failed. Please try again.'
  } finally {
    loading.value = false
  }
}

const clearFilters = async () => {
  Object.assign(filters, {
    search: '',
    category: '',
    source: '',
    dateFrom: '',
    dateTo: ''
  })
  
  hasSearched.value = false
  searchError.value = null
  
  try {
    await articlesStore.clearFilters()
  } catch (error: any) {
    console.error('Failed to clear filters:', error)
  }
}

const handleSort = async () => {
  try {
    if (hasSearched.value) {
      await articlesStore.searchArticles({ ...filters, sort: sortBy.value })
    } else {
      await articlesStore.updateFilters({ ...filters, sort: sortBy.value })
    }
  } catch (error: any) {
    console.error('Failed to sort articles:', error)
  }
}

const changePage = async (page: number) => {
  if (page < 1 || page > pagination.value.totalPages) return
  
  loading.value = true
  
  try {
    if (hasSearched.value) {
      await articlesStore.searchArticles(filters)
    } else {
      await articlesStore.fetchArticles(page)
    }
  } catch (error: any) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const viewArticle = (article: any) => {
  router.push(`/article/${article.id}`)
}

onMounted(async () => {
  try {
    await userPreferencesStore.fetchCategories()
    await userPreferencesStore.fetchSources()
  } catch (error: any) {
    console.error('Failed to load filters:', error)
  }
})


</script>
