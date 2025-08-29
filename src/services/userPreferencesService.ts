import { apiService } from './api'
import type { ApiResponse } from './api'
import type { CategoryOption, SourceOption } from './articleService'
import { API_ENDPOINTS } from '@/constants'

export interface UserPreferences {
  categories: string[]
  sources: string[]
}

export interface UserPreferencesResponse {
  categories: CategoryOption[]
  sources: SourceOption[]
}

class UserPreferencesService {
  async getUserPreferences(): Promise<ApiResponse<UserPreferencesResponse>> {
    return await apiService.get<UserPreferencesResponse>(API_ENDPOINTS.USER.PREFERENCES)
  }

  async updatePreferences(preferences: UserPreferences): Promise<ApiResponse<void>> {
    return await apiService.post<void>(API_ENDPOINTS.USER.PREFERENCES, preferences)
  }

  async toggleCategory(category: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>(API_ENDPOINTS.USER.TOGGLE_CATEGORY(category))
  }

  async toggleSource(source: string): Promise<ApiResponse<void>> {
    return await apiService.post<void>(API_ENDPOINTS.USER.TOGGLE_SOURCE(source))
  }

  async getUserCategories(): Promise<ApiResponse<CategoryOption[]>> {
    return await apiService.get<CategoryOption[]>(API_ENDPOINTS.USER.USER_CATEGORIES)
  }

  async getUserSources(): Promise<ApiResponse<SourceOption[]>> {
    return await apiService.get<SourceOption[]>(API_ENDPOINTS.USER.USER_SOURCES)
  }
}

export const userPreferencesService = new UserPreferencesService()
