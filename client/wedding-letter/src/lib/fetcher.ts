import { apiClient } from '@/api'

export const fetcher = <T>(url: string): Promise<T> => apiClient.get<T>(url)

// ?fetcher 역할에 대해 잘 모르겟음
