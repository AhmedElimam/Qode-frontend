import axios from 'axios'

interface UserPreference {
  id: number
  user_id: number
  category: string
  source: string
  created_at: string
  updated_at: string
}

interface UserPreferencesState {
  categories: string[]
  sources: string[]
  selectedCategories: string[]
  selectedSources: string[]
  loading: boolean
}

const state: UserPreferencesState = {
  categories: [],
  sources: [],
  selectedCategories: [],
  selectedSources: [],
  loading: false
}

const mutations = {
  SET_CATEGORIES(state: UserPreferencesState, categories: string[]) {
    state.categories = categories
  },
  SET_SOURCES(state: UserPreferencesState, sources: string[]) {
    state.sources = sources
  },
  SET_SELECTED_CATEGORIES(state: UserPreferencesState, categories: string[]) {
    state.selectedCategories = categories
  },
  SET_SELECTED_SOURCES(state: UserPreferencesState, sources: string[]) {
    state.selectedSources = sources
  },
  SET_LOADING(state: UserPreferencesState, loading: boolean) {
    state.loading = loading
  },
  ADD_CATEGORY(state: UserPreferencesState, category: string) {
    if (!state.selectedCategories.includes(category)) {
      state.selectedCategories.push(category)
    }
  },
  REMOVE_CATEGORY(state: UserPreferencesState, category: string) {
    state.selectedCategories = state.selectedCategories.filter(c => c !== category)
  },
  ADD_SOURCE(state: UserPreferencesState, source: string) {
    if (!state.selectedSources.includes(source)) {
      state.selectedSources.push(source)
    }
  },
  REMOVE_SOURCE(state: UserPreferencesState, source: string) {
    state.selectedSources = state.selectedSources.filter(s => s !== source)
  }
}

const actions = {
  async fetchCategories({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/categories')
      commit('SET_CATEGORIES', response.data.data)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchSources({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/sources')
      commit('SET_SOURCES', response.data.data)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserPreferences({ commit }: any) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/user/preferences')
      const preferences = response.data.data
      
      const categories = preferences
        .filter((p: UserPreference) => p.category)
        .map((p: UserPreference) => p.category)
      
      const sources = preferences
        .filter((p: UserPreference) => p.source)
        .map((p: UserPreference) => p.source)
      
      commit('SET_SELECTED_CATEGORIES', categories)
      commit('SET_SELECTED_SOURCES', sources)
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updatePreferences({ commit, state }: any) {
    commit('SET_LOADING', true)
    try {
      const preferences = [
        ...state.selectedCategories.map((category: string) => ({ category })),
        ...state.selectedSources.map((source: string) => ({ source }))
      ]
      
      await axios.post('/api/user/preferences', { preferences })
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async addCategory({ commit, dispatch }: any, category: string) {
    commit('ADD_CATEGORY', category)
    await dispatch('updatePreferences')
  },

  async removeCategory({ commit, dispatch }: any, category: string) {
    commit('REMOVE_CATEGORY', category)
    await dispatch('updatePreferences')
  },

  async addSource({ commit, dispatch }: any, source: string) {
    commit('ADD_SOURCE', source)
    await dispatch('updatePreferences')
  },

  async removeSource({ commit, dispatch }: any, source: string) {
    commit('REMOVE_SOURCE', source)
    await dispatch('updatePreferences')
  }
}

const getters = {
  allCategories: (state: UserPreferencesState) => state.categories,
  allSources: (state: UserPreferencesState) => state.sources,
  selectedCategories: (state: UserPreferencesState) => state.selectedCategories,
  selectedSources: (state: UserPreferencesState) => state.selectedSources,
  isLoading: (state: UserPreferencesState) => state.loading,
  hasPreferences: (state: UserPreferencesState) => 
    state.selectedCategories.length > 0 || state.selectedSources.length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
