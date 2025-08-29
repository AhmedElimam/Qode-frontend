<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <h1 class="text-2xl font-bold text-primary-600">Qode News</h1>
          </router-link>
          
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              to="/"
              class="nav-link"
              :class="{ 'active': $route.name === 'home' }"
            >
              Home
            </router-link>
            <router-link
              to="/search"
              class="nav-link"
              :class="{ 'active': $route.name === 'search' }"
            >
              Search
            </router-link>
            <router-link
              to="/preferences"
              class="nav-link"
              :class="{ 'active': $route.name === 'preferences' }"
            >
              Preferences
            </router-link>
          </div>
        </div>

        <div class="flex items-center">
          <div class="relative">
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2"
            >
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-primary-600 font-medium text-sm">
                  {{ userInitials }}
                </span>
              </div>
              <span class="hidden md:block text-sm font-medium">{{ currentUser?.name }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isUserMenuOpen = false"
              >
                Profile
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="mobile-nav-link"
          :class="{ 'active': $route.name === 'home' }"
        >
          Home
        </router-link>
        <router-link
          to="/search"
          class="mobile-nav-link"
          :class="{ 'active': $route.name === 'search' }"
        >
          Search
        </router-link>
        <router-link
          to="/preferences"
          class="mobile-nav-link"
          :class="{ 'active': $route.name === 'preferences' }"
        >
          Preferences
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isUserMenuOpen = ref(false)

const currentUser = computed(() => authStore.currentUser)

const userInitials = computed(() => {
  if (!currentUser.value?.name) return 'U'
  return currentUser.value.name
    .split(' ')
    .map((name: string) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200;
}

.nav-link.active {
  @apply border-primary-500 text-primary-600;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200;
}

.mobile-nav-link.active {
  @apply bg-primary-50 text-primary-600;
}
</style>
