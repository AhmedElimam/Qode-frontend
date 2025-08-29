import { defineStore } from 'pinia'
import { articleService } from '@/services/articleService'
import type { Article, SearchFilters, CategoryOption, SourceOption } from '@/services/articleService'
import { PAGINATION } from '@/constants'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
    filteredArticles: [] as Article[],
    currentArticle: null as Article | null,
    loading: false,
    filters: {
      search: '',
      category: '',
      source: '',
      dateFrom: '',
      dateTo: '',
      sort: 'published_at'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: PAGINATION.DEFAULT_PER_PAGE,
      total: 0
    }
  }),

  getters: {
    allArticles: (state) => state.articles,
    hasArticles: (state) => state.articles.length > 0,
    isLoading: (state) => state.loading
  },

  actions: {
    async fetchArticles(page = 1) {
      this.loading = true
      try {
        const response = await articleService.getArticles(page, this.pagination.perPage)
        this.articles = response.data
        this.filteredArticles = response.data
        this.pagination = {
          currentPage: response.meta?.current_page || 1,
          totalPages: response.meta?.last_page || 1,
          total: response.meta?.total || 0,
          perPage: this.pagination.perPage
        }
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchArticle(id: number) {
      this.loading = true
      try {
        const response = await articleService.getArticle(id)
        this.currentArticle = response.data
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchPersonalizedArticles(page = 1) {
      this.loading = true
      try {
        const response = await articleService.getPersonalizedArticles(page, this.pagination.perPage)
        this.articles = response.data
        this.filteredArticles = response.data
        this.pagination = {
          currentPage: response.meta?.current_page || 1,
          totalPages: response.meta?.last_page || 1,
          total: response.meta?.total || 0,
          perPage: this.pagination.perPage
        }
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchArticles(searchFilters: Partial<SearchFilters> & { page?: number }) {
      this.loading = true
      try {
        const params: SearchFilters = {
          per_page: this.pagination.perPage
        }
        
        if (searchFilters.keyword || this.filters.search) {
          params.keyword = searchFilters.keyword || this.filters.search
        }
        if (searchFilters.source || this.filters.source) {
          params.source = searchFilters.source || this.filters.source
        }
        if (searchFilters.category || this.filters.category) {
          params.category = searchFilters.category || this.filters.category
        }
        if (searchFilters.start_date || this.filters.dateFrom) {
          params.start_date = searchFilters.start_date || this.filters.dateFrom
        }
        if (searchFilters.end_date || this.filters.dateTo) {
          params.end_date = searchFilters.end_date || this.filters.dateTo
        }
        
        const response = await articleService.searchArticles(params)
        
        const articles = (response.data as any).data || response.data
        const count = (response.data as any).count || articles.length
        
        this.articles = articles
        this.filteredArticles = articles
        this.pagination = {
          currentPage: 1,
          totalPages: 1,
          total: count,
          perPage: this.pagination.perPage
        }
        
        this.filters = { ...this.filters, ...searchFilters }
        
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateFilters(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters }
      await this.fetchArticles(1)
    },

    async clearFilters() {
      this.filters = {
        search: '',
        category: '',
        source: '',
        dateFrom: '',
        dateTo: '',
        sort: 'published_at'
      }
      await this.fetchArticles(1)
    },

    async refreshArticles() {
      try {
        const response = await articleService.refreshArticles()
        return response
      } catch (error: any) {
        throw error
      }
    }
  }
})
