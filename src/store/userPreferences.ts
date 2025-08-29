import { defineStore } from 'pinia'
import { userPreferencesService } from '@/services/userPreferencesService'
import { articleService } from '@/services/articleService'
import type { CategoryOption, SourceOption } from '@/services/articleService'
import type { UserPreferences } from '@/services/userPreferencesService'

export const useUserPreferencesStore = defineStore('userPreferences', {
  state: () => ({
    categories: [] as CategoryOption[],
    sources: [] as SourceOption[],
    selectedCategories: [] as string[],
    selectedSources: [] as string[],
    loading: false
  }),

  getters: {
    allCategories: (state): CategoryOption[] => state.categories,
    allSources: (state): SourceOption[] => state.sources,
    isLoading: (state): boolean => state.loading,
    hasPreferences: (state): boolean => 
      (state.selectedCategories?.length > 0) || 
      (state.selectedSources?.length > 0)
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await articleService.getCategories()
        this.categories = response.data
        this.validateAndCleanPreferences()
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSources() {
      this.loading = true
      try {
        const response = await articleService.getSources()
        this.sources = response.data
        this.validateAndCleanPreferences()
        return response
      } catch (error: any) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUserPreferences() {
      this.loading = true
      try {
        const response = await userPreferencesService.getUserPreferences()
        const preferences = response.data
        
        console.log('User preferences response:', preferences)
        console.log('Available categories:', this.categories)
        console.log('Available sources:', this.sources)
        
        const validCategories = preferences.categories || []
        const validSources = preferences.sources || []
        
        console.log('Raw categories from API:', validCategories)
        console.log('Raw sources from API:', validSources)
        
        this.selectedCategories = validCategories.filter(category => 
          typeof category === 'string' && this.categories.some(cat => cat.value === category)
        )
        this.selectedSources = validSources.filter(source => 
          typeof source === 'string' && this.sources.some(src => src.value === source)
        )
        
        console.log('Filtered selected categories:', this.selectedCategories)
        console.log('Filtered selected sources:', this.selectedSources)
        
        return response
      } catch (error: any) {
        console.error('Error fetching user preferences:', error)
        this.selectedCategories = []
        this.selectedSources = []
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePreferences() {
      this.loading = true
      try {
        const data: UserPreferences = {
          categories: this.selectedCategories || [],
          sources: this.selectedSources || []
        }
        
        console.log('Updating preferences with data:', data)
        
        await userPreferencesService.updatePreferences(data)
        
        console.log('Preferences updated successfully')
      } catch (error: any) {
        console.error('Error updating preferences:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCategory(category: string) {
      console.log('Adding category:', category)
      if (!this.selectedCategories?.includes(category)) {
        if (!this.selectedCategories) this.selectedCategories = []
        this.selectedCategories.push(category)
        console.log('Categories after adding:', this.selectedCategories)
        await this.updatePreferences()
      }
    },

    async removeCategory(category: string) {
      console.log('Removing category:', category)
      if (this.selectedCategories) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== category)
        console.log('Categories after removing:', this.selectedCategories)
        await this.updatePreferences()
      }
    },

    async addSource(source: string) {
      console.log('Adding source:', source)
      if (!this.selectedSources?.includes(source)) {
        if (!this.selectedSources) this.selectedSources = []
        this.selectedSources.push(source)
        console.log('Sources after adding:', this.selectedSources)
        await this.updatePreferences()
      }
    },

    async removeSource(source: string) {
      console.log('Removing source:', source)
      if (this.selectedSources) {
        this.selectedSources = this.selectedSources.filter(s => s !== source)
        console.log('Sources after removing:', this.selectedSources)
        await this.updatePreferences()
      }
    },

    validateAndCleanPreferences() {
      const validCategories = this.selectedCategories.filter(category => 
        typeof category === 'string' && this.categories.some(cat => cat.value === category)
      )
      const validSources = this.selectedSources.filter(source => 
        typeof source === 'string' && this.sources.some(src => src.value === source)
      )
      
      this.selectedCategories = validCategories
      this.selectedSources = validSources
    }
  }
})
