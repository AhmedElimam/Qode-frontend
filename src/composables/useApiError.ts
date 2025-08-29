import { ref } from 'vue'

export function useApiError() {
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    errorMessage = 'An error occurred'
  ): Promise<T | null> => {
    error.value = null
    isLoading.value = true

    try {
      const result = await apiCall()
      return result
    } catch (err: any) {
      error.value = err.message || errorMessage
      return null
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    isLoading,
    handleApiCall,
    clearError
  }
}
