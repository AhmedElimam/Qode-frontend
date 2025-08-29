<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="article" class="space-y-6">
      <div class="flex items-center space-x-4">
        <router-link to="/" class="text-primary-600 hover:text-primary-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">{{ article.title }}</h1>
      </div>

      <div class="card overflow-hidden">
        <img
          v-if="article.image_url"
          :src="article.image_url"
          :alt="article.title"
          class="w-full h-64 md:h-96 object-cover"
          @error="handleImageError"
        />
        
        <div class="p-6">
          <div class="flex items-center space-x-4 mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {{ article.category }}
            </span>
            <span class="text-sm text-gray-500">{{ formatDate(article.published_at) }}</span>
            <span class="text-sm font-medium text-gray-700">{{ article.source }}</span>
            <span v-if="article.author" class="text-sm text-gray-500">by {{ article.author }}</span>
          </div>

          <div class="prose max-w-none">
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
              {{ article.description }}
            </p>
            
            <div class="text-gray-800 leading-relaxed" v-html="article.content"></div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-200">
            <a
              :href="article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary inline-flex items-center"
            >
              Read full article
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Article not found</h3>
      <p class="mt-1 text-sm text-gray-500">The article you're looking for doesn't exist.</p>
      <router-link to="/" class="mt-4 btn-primary">
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useArticlesStore } from '@/store/articles'
import { useRoute } from 'vue-router'

const articlesStore = useArticlesStore()
const route = useRoute()

const article = computed(() => articlesStore.currentArticle)
const loading = computed(() => articlesStore.isLoading)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(async () => {
  const articleId = parseInt(route.params.id as string)
  if (articleId) {
    try {
      await articlesStore.fetchArticle(articleId)
    } catch (error: any) {
      console.error('Failed to load article:', error)
    }
  }
})
</script>
