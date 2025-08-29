import { apiService } from './api'
import type { ApiResponse, PaginatedResponse } from './api'
import { API_ENDPOINTS, PAGINATION } from '@/constants'

export interface Article {
  id: string | number
  title: string
  description: string
  content: string
  url: string
  image_url: string
  author: string
  source: {
    value: string
    display_name: string
  }
  category: {
    value: string
    display_name: string
  }
  published_at: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  keyword?: string
  source?: string
  category?: string
  start_date?: string
  end_date?: string
  sort?: string
  page?: number
  per_page?: number
}

export interface CategoryOption {
  value: string
  display_name: string
}

export interface SourceOption {
  value: string
  display_name: string
}

class ArticleService {
  async getArticles(page = 1, perPage = PAGINATION.DEFAULT_PER_PAGE): Promise<PaginatedResponse<Article[]>> {
    return await apiService.get<Article[]>(API_ENDPOINTS.ARTICLES.LIST, { page, per_page: perPage })
  }

  async getArticle(id: number): Promise<ApiResponse<Article>> {
    return await apiService.get<Article>(API_ENDPOINTS.ARTICLES.DETAIL(id))
  }

  async searchArticles(filters: SearchFilters): Promise<ApiResponse<Article[]>> {
    return await apiService.get<Article[]>(API_ENDPOINTS.ARTICLES.SEARCH, filters)
  }

  async getPersonalizedArticles(page = 1, perPage = PAGINATION.DEFAULT_PER_PAGE): Promise<PaginatedResponse<Article[]>> {
    return await apiService.get<Article[]>(API_ENDPOINTS.ARTICLES.PERSONALIZED, { 
      page, 
      per_page: perPage, 
      personalized: true 
    })
  }

  async getArticlesByCategory(category: string, page = 1, perPage = PAGINATION.DEFAULT_PER_PAGE): Promise<PaginatedResponse<Article[]>> {
    return await apiService.get<Article[]>(API_ENDPOINTS.ARTICLES.BY_CATEGORY(category), { 
      page, 
      per_page: perPage 
    })
  }

  async getArticlesBySource(source: string, page = 1, perPage = PAGINATION.DEFAULT_PER_PAGE): Promise<PaginatedResponse<Article[]>> {
    return await apiService.get<Article[]>(API_ENDPOINTS.ARTICLES.BY_SOURCE(source), { 
      page, 
      per_page: perPage 
    })
  }

  async refreshArticles(): Promise<ApiResponse<{ count: number }>> {
    return await apiService.post<{ count: number }>(API_ENDPOINTS.ARTICLES.REFRESH)
  }

  async getCategories(): Promise<ApiResponse<CategoryOption[]>> {
    return await apiService.get<CategoryOption[]>(API_ENDPOINTS.ARTICLES.CATEGORIES)
  }

  async getSources(): Promise<ApiResponse<SourceOption[]>> {
    return await apiService.get<SourceOption[]>(API_ENDPOINTS.ARTICLES.SOURCES)
  }
}

export const articleService = new ArticleService()
