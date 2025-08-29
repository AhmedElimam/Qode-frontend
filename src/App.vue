<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <nav-bar v-if="isAuthenticated" />
    
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <loading-overlay v-if="isLoading" />
    <error-toast v-if="error" :message="error" @close="clearError" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useUserPreferencesStore } from '@/store/userPreferences'
import NavBar from '@/components/layout/NavBar.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import ErrorToast from '@/components/ui/ErrorToast.vue'

const authStore = useAuthStore()
const userPreferencesStore = useUserPreferencesStore()

const isLoading = ref(false)
const error = ref<string | null>(null)

const isAuthenticated = computed(() => authStore.isLoggedIn)

const clearError = () => {
  error.value = null
}

onMounted(async () => {
  console.log('App.vue mounted, isAuthenticated:', isAuthenticated.value)
  if (isAuthenticated.value) {
    try {
      isLoading.value = true
      console.log('Fetching user data...')
      await authStore.fetchUser()
      console.log('Fetching categories...')
      await userPreferencesStore.fetchCategories()
      console.log('Fetching sources...')
      await userPreferencesStore.fetchSources()
      console.log('Fetching user preferences...')
      await userPreferencesStore.fetchUserPreferences()
      console.log('All data loaded successfully')
    } catch (err: any) {
      console.error('Error loading user data:', err)
      console.error('Error details:', err.response?.data || err.message)
      error.value = err.message || 'Failed to load user data'
    } finally {
      isLoading.value = false
    }
  }
})
</script>
<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
