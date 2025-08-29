import { apiService } from './api'
import type { ApiResponse } from './api'
import { API_ENDPOINTS } from '@/constants'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response.data
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response.data
  }

  async logout(): Promise<void> {
    await apiService.post(API_ENDPOINTS.AUTH.LOGOUT)
  }

  async getUserInfo(): Promise<User> {
    const response = await apiService.get<User>(API_ENDPOINTS.AUTH.USER_INFO)
    return response.data
  }
}

export const authService = new AuthService()
