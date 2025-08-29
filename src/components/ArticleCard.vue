<template>
  <article class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden">
    <div class="aspect-w-16 aspect-h-9">
      <img
        :src="article.image_url || '/placeholder-news.jpg'"
        :alt="article.title"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
    </div>
    
    <div class="p-6">
      <div class="flex items-center space-x-2 mb-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {{ article.category?.display_name || article.category?.value || '' }}
        </span>
        <span class="text-xs text-gray-500">{{ formatDate(article.published_at) }}</span>
      </div>
      
      <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {{ article.title }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ article.description }}
      </p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-xs font-medium text-gray-700">{{ article.source?.display_name || article.source?.value || '' }}</span>
          <span v-if="article.author" class="text-xs text-gray-500">by {{ article.author }}</span>
        </div>
        
        <button
          @click.stop="openArticle"
          class="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Read more
          <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Category {
  value: string
  display_name: string
}

interface Source {
  value: string
  display_name: string
}

interface Article {
  id: string | number
  title: string
  description: string
  content: string
  url: string
  image_url: string
  published_at: string
  source: Source
  category: Category
  author: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

const props = defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  click: [article: Article]
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-news.jpg'
}

const openArticle = () => {
  emit('click', props.article)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
