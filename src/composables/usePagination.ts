import { ref, computed } from 'vue'

export interface PaginationState {
  currentPage: number
  totalPages: number
  total: number
  perPage: number
}

export function usePagination(initialPerPage = 12) {
  const pagination = ref<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: initialPerPage
  })

  const hasNextPage = computed(() => pagination.value.currentPage < pagination.value.totalPages)
  const hasPrevPage = computed(() => pagination.value.currentPage > 1)
  const isFirstPage = computed(() => pagination.value.currentPage === 1)
  const isLastPage = computed(() => pagination.value.currentPage === pagination.value.totalPages)

  const setPagination = (newPagination: Partial<PaginationState>) => {
    Object.assign(pagination.value, newPagination)
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      pagination.value.currentPage++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      pagination.value.currentPage--
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.currentPage = page
    }
  }

  const resetPagination = () => {
    pagination.value.currentPage = 1
  }

  return {
    pagination,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    setPagination,
    nextPage,
    prevPage,
    goToPage,
    resetPagination
  }
}
