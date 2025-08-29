import { reactive, ref } from 'vue'

export function useForm<T extends Record<string, any>>(initialData: T) {
  const form = reactive<T>({ ...initialData })
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)

  const resetForm = () => {
    Object.assign(form, initialData)
    Object.keys(errors).forEach(key => {
      delete (errors as any)[key]
    })
  }

  const setError = (field: keyof T, message: string) => {
    (errors as any)[field] = message
  }

  const clearError = (field: keyof T) => {
    delete (errors as any)[field]
  }

  const clearAllErrors = () => {
    Object.keys(errors).forEach(key => {
      delete (errors as any)[key]
    })
  }

  const hasErrors = () => {
    return Object.keys(errors).length > 0
  }

  return {
    form,
    errors,
    isSubmitting,
    resetForm,
    setError,
    clearError,
    clearAllErrors,
    hasErrors
  }
}
