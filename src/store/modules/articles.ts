import axios from 'axios'

interface Article {
  id: number
  title: string
  description: string
  content: string
  url: string
  image_url: string
  published_at: string
  source: string
  category: string
  author: string
}

interface ArticlesState {
  articles: Article[]
  filteredArticles: Article[]
  currentArticle: Article | null
  loading: boolean
  filters: {
    search: string
    category: string
    source: string
    dateFrom: string
    dateTo: string
  }
  pagination: {
    currentPage: number
    totalPages: number
    perPage: number
    total: number
  }
}

const state: ArticlesState = {
  articles: [],
  filteredArticles: [],
  currentArticle: null,
  loading: false,
  filters: {
    search: '',
    category: '',
    source: '',
    dateFrom: '',
    dateTo: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 12,
    total: 0
  }
}

const mutations = {
  SET_ARTICLES(state: ArticlesState, articles: Article[]) {
    state.articles = articles
    state.filteredArticles = articles
  },
  SET_FILTERED_ARTICLES(state: ArticlesState, articles: Article[]) {
    state.filteredArticles = articles
  },
  SET_CURRENT_ARTICLE(state: ArticlesState, article: Article) {
    state.currentArticle = article
  },
  SET_LOADING(state: ArticlesState, loading: boolean) {
    state.loading = loading
  },
  SET_FILTERS(state: ArticlesState, filters: Partial<ArticlesState['filters']>) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_PAGINATION(state: ArticlesState, pagination: Partial<ArticlesState['pagination']>) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  CLEAR_FILTERS(state: ArticlesState) {
    state.filters = {
      search: '',
      category: '',
      source: '',
      dateFrom: '',
      dateTo: ''
    }
  }
}

const actions = {
  async fetchArticles({ commit, state }: any, page = 1) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page,
        per_page: state.pagination.perPage,
        ...state.filters
      }
      
      const response = await axios.get('/api/articles', { params })
      const { data, meta } = response.data
      
      commit('SET_ARTICLES', data)
      commit('SET_PAGINATION', {
        currentPage: meta.current_page,
        totalPages: meta.last_page,
        total: meta.total
      })
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchArticle({ commit }: any, id: number) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get(`/api/articles/${id}`)
      commit('SET_CURRENT_ARTICLE', response.data.data)
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchPersonalizedArticles({ commit, state }: any, page = 1) {
    commit('SET_LOADING', true)
    try {
      const params = {
        page,
        per_page: state.pagination.perPage,
        personalized: true
      }
      
      const response = await axios.get('/api/articles/personalized', { params })
      const { data, meta } = response.data
      
      commit('SET_ARTICLES', data)
      commit('SET_PAGINATION', {
        currentPage: meta.current_page,
        totalPages: meta.last_page,
        total: meta.total
      })
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    } finally {
      commit('SET_LOADING', false)
    }
  },

  updateFilters({ commit, dispatch }: any, filters: Partial<ArticlesState['filters']>) {
    commit('SET_FILTERS', filters)
    commit('SET_PAGINATION', { currentPage: 1 })
    dispatch('fetchArticles', 1)
  },

  clearFilters({ commit, dispatch }: any) {
    commit('CLEAR_FILTERS')
    commit('SET_PAGINATION', { currentPage: 1 })
    dispatch('fetchArticles', 1)
  }
}

const getters = {
  allArticles: (state: ArticlesState) => state.articles,
  filteredArticles: (state: ArticlesState) => state.filteredArticles,
  currentArticle: (state: ArticlesState) => state.currentArticle,
  isLoading: (state: ArticlesState) => state.loading,
  filters: (state: ArticlesState) => state.filters,
  pagination: (state: ArticlesState) => state.pagination,
  hasArticles: (state: ArticlesState) => state.articles.length > 0
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
