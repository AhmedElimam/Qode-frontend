export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    USER_INFO: '/api/auth/userinfo'
  },
  ARTICLES: {
    LIST: '/api/articles',
    SEARCH: '/api/articles/search',
    PERSONALIZED: '/api/articles/personalized',
    CATEGORIES: '/api/articles/categories',
    SOURCES: '/api/sources',
    BY_CATEGORY: (category: string) => `/api/articles/category/${category}`,
    BY_SOURCE: (source: string) => `/api/articles/source/${source}`,
    DETAIL: (id: number) => `/api/articles/${id}`,
    REFRESH: '/api/articles/refresh'
  },
  USER: {
    PREFERENCES: '/api/user/preferences',
    TOGGLE_CATEGORY: (category: string) => `/api/user/categories/${category}/toggle`,
    TOGGLE_SOURCE: (source: string) => `/api/user/sources/${source}/toggle`,
    USER_CATEGORIES: '/api/user/categories',
    USER_SOURCES: '/api/user/sources'
  }
} as const

export const PAGINATION = {
  DEFAULT_PER_PAGE: 12,
  MAX_PER_PAGE: 50
} as const

export const CACHE_TTL = {
  SHORT: 2 * 60 * 1000,
  MEDIUM: 5 * 60 * 1000,
  LONG: 15 * 60 * 1000
} as const

export const SORT_OPTIONS = {
  PUBLISHED_AT: 'published_at',
  TITLE: 'title',
  SOURCE: 'source'
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  PREFERENCES: '/preferences',
  PROFILE: '/profile',
  ARTICLE: (id: number) => `/article/${id}`
} as const
