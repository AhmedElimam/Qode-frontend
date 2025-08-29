import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const state: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token')
}

const mutations = {
  SET_USER(state: AuthState, user: User) {
    state.user = user
    state.isAuthenticated = true
  },
  SET_TOKEN(state: AuthState, token: string) {
    state.token = token
    localStorage.setItem('token', token)
  },
  LOGOUT(state: AuthState) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
  }
}

const actions = {
  async login({ commit }: any, credentials: { email: string; password: string }) {
    try {
      const response = await axios.post('/api/auth/login', credentials)
      const { user, token } = response.data.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  async register({ commit }: any, userData: { name: string; email: string; password: string; password_confirmation: string }) {
    try {
      const response = await axios.post('/api/auth/register', userData)
      const { user, token } = response.data.data
      
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return response.data
    } catch (error: any) {
      throw error.response?.data || error.message
    }
  },

  async logout({ commit }: any) {
    try {
      await axios.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      commit('LOGOUT')
      delete axios.defaults.headers.common['Authorization']
    }
  },

  async fetchUser({ commit }: any) {
    try {
      const response = await axios.get('/api/user')
      commit('SET_USER', response.data.data)
    } catch (error: any) {
      commit('LOGOUT')
      throw error.response?.data || error.message
    }
  }
}

const getters = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  currentUser: (state: AuthState) => state.user,
  token: (state: AuthState) => state.token
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
