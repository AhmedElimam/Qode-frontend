import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { User, LoginRequest, RegisterRequest } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    async login(credentials: LoginRequest) {
      try {
        const response = await authService.login(credentials)
        this.setAuthData(response.user, response.token)
        return response
      } catch (error: any) {
        throw error
      }
    },

    async register(userData: RegisterRequest) {
      try {
        const response = await authService.register(userData)
        this.setAuthData(response.user, response.token)
        return response
      } catch (error: any) {
        throw error
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuthData()
      }
    },

    async fetchUser() {
      try {
        const user = await authService.getUserInfo()
        this.user = user
        return user
      } catch (error: any) {
        throw error
      }
    },

    setAuthData(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('token', token)
    },

    clearAuthData() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    ensureToken() {
      if (this.token) {
        localStorage.setItem('token', this.token)
      }
    }
  }
})
